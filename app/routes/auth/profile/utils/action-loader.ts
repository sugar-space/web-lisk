import { adventurer } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'
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

  const checkAddress = await axios.post(`${process.env.VITE_BE_URL}/account/check`, {
    address: session,
  })

  let avatar = createAvatar(adventurer, {
    seed: session,
  }).toDataUri();

  if (checkAddress.data.success) {
    const fetched = await axios.get(`${process.env.VITE_BE_URL}/account/${checkAddress.data.username}`);
    avatar = fetched.data.avatar ?? avatar;
  }

  console.log(checkAddress)

  const filteredTokens = []
  if (checkAddress.data.success) {
    const client = createPublicClient({
      chain: liskSepolia,
      transport: http(),
      // chain:  sepolia,
      // transport: http("https://sepolia.infura.io/v3/ff13c1b25d9f4e939b5143372e0f5f41"),
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

        console.log("isTokenWhitelisted", token.name, token.token_address, isTokenWhitelisted)

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
    bio: checkAddress.data.bio,
    avatar,
    filteredTokens,
  }
}
