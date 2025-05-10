import { getWalletSession } from "@services/cookie"
import axios from "axios"
import { createPublicClient, formatUnits, http, parseEther } from "viem"
import { sepolia } from "viem/chains"
import { CONTRACT_ADDRESS } from "~/constants/CA"
import { COINS } from "~/constants/coins"
import type { Route } from "../+types"
import { ABI } from "~/constants/ABI"
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") return

  const body = await request.formData()
  const jsonData = Object.fromEntries(body.entries())

  const saveUser = await axios.post(`${process.env.VITE_BE_URL}/account`, {
    address: jsonData.address,
    username: jsonData.username,
  })

  return {
    success: saveUser.data.success,
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getWalletSession(request)

  const checkAddress = await axios.post(`${process.env.VITE_BE_URL}/account/check`, {
    address: session,
  })

  let avatar = `https://placehold.co/50x50/ffffff/000000?font=poppins&text=?`
  if (checkAddress.data.success) {
    avatar = await axios
      .get(`${process.env.VITE_BE_URL}/account/${checkAddress.data.username}`)
      .then((res) => res.data.avatar ?? "https://placehold.co/50")
  }

  const filteredTokens = []
  if (checkAddress.data.success) {
    const client = createPublicClient({
      chain: sepolia,
      transport: http("https://sepolia.infura.io/v3/ff13c1b25d9f4e939b5143372e0f5f41"),
    })

    for (const token of COINS) {
      let balance = await client.readContract({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "creatorBalances",
        args: [session, token.token_address],
      })

      if (String(balance) == "0") {
        balance = 0
      } else {
        balance = formatUnits(BigInt(String(balance)), token.decimals)
      }

      if (token.token_address === "0x0000000000000000000000000000000000000000") {
        filteredTokens.push({
          ...token,
          allowed: true,
          balance,
        })
      } else {
        const isTokenWhitelisted = await client.readContract({
          abi: ABI,
          address: CONTRACT_ADDRESS,
          functionName: "isTokenWhitelisted",
          args: [session, token.token_address],
        })

        if (isTokenWhitelisted) {
          filteredTokens.push({
            ...token,
            allowed: true,
            balance,
          })
        } else {
          filteredTokens.push({ ...token, balance })
        }
      }
    }
  }

  return {
    isAlreadySetUsername: checkAddress.data.success,
    address: session,
    username: checkAddress.data.username,
    avatar,
    filteredTokens,
  }
}
