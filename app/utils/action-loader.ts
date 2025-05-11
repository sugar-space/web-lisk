import { funEmoji } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'
import { getWalletSession } from "@services/cookie"
import axios from "axios"
import { createPublicClient, formatUnits, http } from "viem"
import { liskSepolia } from "viem/chains"
import { ABI } from "~/constants/ABI"
import { CONTRACT_ADDRESS } from "~/constants/CA"
import { COINS } from "~/constants/coins"
import type { TransactionItem } from '~/types/TransactionItem'
import type { Route } from "../routes/auth/profile/+types"

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

      const balance = String(balanceRaw) === "0"
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

  const trxRes = await axios.get<{ data: TransactionItem[] }>(
    `${process.env.VITE_BE_URL}/trx/summary/${session}`
  )
  const summary = trxRes.data.data

  const totalIdrx = summary.reduce((sum, tx) => {
    return tx.tokenType === "IDRX" ? sum + tx.amount : sum
  }, 0)

  const currentIdrRate = await axios.get("https://api.exchangerate-api.com/v4/latest/USD")
  const usdtRateIdr = currentIdrRate.data.rates.IDR

  const totalUsdt = totalIdrx / usdtRateIdr

  const highestReceived = summary.reduce((max, tx) => Math.max(max, tx.amount), 0)

  const donorTotals = summary.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.from] = (acc[tx.from] || 0) + tx.amount
    return acc
  }, {})
  const [mostSweetName, mostSweetTotal] = Object.entries(donorTotals).sort((a, b) => b[1] - a[1])[0] ?? ["N/A", 0]

  return {
    isAlreadySetUsername: checkAddress.data.success,
    address: session,
    username: checkAddress.data.username,
    bio: checkAddress.data.bio,
    avatar,
    filteredTokens,
    summary,
    highestReceived,
    mostSweet: {
      name: mostSweetName,
      total: mostSweetTotal,
    },
    totalUsdt,
  }
}
