import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn/table"
import { ButtonMagnet } from "@sugar/button"
import { Card } from "@sugar/card"
import { useEffect, useState } from "react"
import { redirect, useNavigate } from "react-router"
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { ABI } from "~/constants/ABI"
import { CONTRACT_ADDRESS } from "~/constants/CA"
import { COINS } from "~/constants/coins"
import { cn } from "~/utils/cn"
import type { Route } from "./+types"
import { createPublicClient, formatUnits, http } from "viem"
import { liskSepolia, lisk } from "viem/chains"
import { getWalletSession } from "@services/cookie"
import { getSocialMetas } from "~/utils/seo"

export function meta({}: Route.MetaArgs) {
  return [
    ...getSocialMetas({
      title: "Owner - Sugar",
      description: "Owner Sugar - Spread sweetness into communities, streamer in web3.",
      path: "/",
    }),
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getWalletSession(request)
  const client = createPublicClient({
    chain: lisk,
    transport: http(),
    // chain: sepolia,
    // transport: http("https://sepolia.infura.io/v3/ff13c1b25d9f4e939b5143372e0f5f41"),
  })

  const ownerAddress = await client.readContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: "owner",
  })

  if (String(ownerAddress) !== String(session)) {
    return redirect("/profile")
  }

  const filteredTokens = []

  for (const token of COINS) {
    let balance = await client.readContract({
      abi: ABI,
      address: CONTRACT_ADDRESS,
      functionName: "ownerFees",
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

  return {
    filteredTokens,
  }
}

export default function OwnerDashboard({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate()
  const { filteredTokens } = loaderData
  const [isLoadingTokenControl, setIsLoadingTokenControl] = useState(false)

  const {
    data: dataWithdraw,
    writeContract: writeWithdraw,
    isPending: isWithdrawPending,
  } = useWriteContract()

  const { data: receiptWithdraw, isLoading: isWithdrawReceiptLoading } =
    useWaitForTransactionReceipt({
      hash: dataWithdraw,
    })

  function handleWithdraw(tokenAddress: string) {
    writeWithdraw({
      abi: ABI,
      address: CONTRACT_ADDRESS,
      functionName: "withdrawOwnerFees",
      args: [tokenAddress],
    })
  }

  useEffect(() => {
    const loading = isWithdrawPending || isWithdrawReceiptLoading

    setIsLoadingTokenControl(loading)
    if (!loading) {
      const timeout = setTimeout(() => {
        navigate("/owner", { replace: true, preventScrollReset: true })
        clearTimeout(timeout)
      }, 100)
    }
  }, [isWithdrawPending, isWithdrawReceiptLoading])

  return (
    <div>
      <Card
        color="transparent"
        textColor="[#77C6D9]"
        title="Token Control"
        className={cn(isLoadingTokenControl && "blur-md")}
      >
        <Table>
          <TableCaption>A list of your balance to withdraw.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTokens.map((val, i) => (
              <TableRow key={i} className="">
                <TableCell className="font-medium flex flex-row gap-4 items-center">
                  <img src={val.icon} className="size-10 object-contain" />
                  <div className="flex flex-col gap-2">
                    <p>{val.symbol}</p>
                    <p className="text-xs">{val.token_address}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {val.balance} ${val.symbol}
                </TableCell>
                <TableCell className="text-right">
                  <ButtonMagnet color="orange" onClick={() => handleWithdraw(val.token_address)}>
                    Withdraw
                  </ButtonMagnet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
