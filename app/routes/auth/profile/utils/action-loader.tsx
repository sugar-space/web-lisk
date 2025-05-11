import { funEmoji } from "@dicebear/collection"
import { createAvatar } from "@dicebear/core"
import { getWalletSession } from "@services/cookie"
import axios from "axios"
import { createPublicClient, formatUnits, http } from "viem"
import { liskSepolia } from "viem/chains"
import { ABI } from "~/constants/ABI"
import { CONTRACT_ADDRESS } from "~/constants/CA"
import { COINS } from "~/constants/coins"
import type { Route } from "../+types"

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") return

  const body = await request.formData()
  const jsonData = Object.fromEntries(body.entries())

  const saveUser = await axios.post(`${process.env.VITE_BE_URL}/account`, {
    address: jsonData.address,
    username: jsonData.username,
    bio: jsonData.bio,
  })

  return {
    success: saveUser.data.success,
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getWalletSession(request)

  const checkAddress = await axios.post<{ success: boolean; username: string; bio: string }>(
    `${process.env.VITE_BE_URL}/account/check`,
    { address: session }
  )

  let avatar = createAvatar(funEmoji, { seed: session }).toDataUri()
  if (checkAddress.data.success) {
    const fetched = await axios.get<{ avatar?: string }>(
      `${process.env.VITE_BE_URL}/account/${checkAddress.data.username}`
    )
    avatar = fetched.data.avatar ?? avatar
  }

  const filteredTokens = []

  if (checkAddress.data.success) {
    const client = createPublicClient({ chain: liskSepolia, transport: http() })

    for (const token of COINS) {
      let balanceRaw = await client.readContract({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "creatorBalances",
        args: [session, token.token_address],
      })

      const balance =
        String(balanceRaw) === "0"
          ? 0
          : parseFloat(formatUnits(BigInt(String(balanceRaw)), token.decimals))

      if (token.token_address === "0x0000000000000000000000000000000000000000") {
        filteredTokens.push({ ...token, allowed: true, balance })
      } else {
        const isTokenWhitelisted = await client.readContract({
          abi: ABI,
          address: CONTRACT_ADDRESS,
          functionName: "isTokenWhitelisted",
          args: [session, token.token_address],
        })
        filteredTokens.push({ ...token, allowed: isTokenWhitelisted, balance })
      }
    }
  }

  return {
    // profile
    isAlreadySetUsername: checkAddress.data.success,
    address: session,
    username: checkAddress.data.username,
    avatar,
    filteredTokens,
    bio: checkAddress.data.bio,
  }
}
