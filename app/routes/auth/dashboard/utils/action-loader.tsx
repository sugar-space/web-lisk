import { getWalletSession } from "@services/cookie"
import axios from "axios"
import type { TransactionItem } from "~/types/TransactionItem"
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

  const [mostSweetName, mostSweetTotal] = Object.entries(donorTotals).sort(
    (a, b) => b[1] - a[1]
  )[0] ?? ["N/A", 0]

  return {
    summary,
    highestReceived,
    mostSweet: {
      name: mostSweetName,
      total: mostSweetTotal,
    },
    totalUsdt,
  }
}
