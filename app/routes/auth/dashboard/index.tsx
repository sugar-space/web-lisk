import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn/table"
import { ForwardLink } from "@sugar/button/arrow"
import { Card } from "@sugar/card"
import { LogoStaticAnimated } from "@sugar/logo-static-animated"
import { Copy } from "lucide-react"
import { useState } from "react"
import type { Route } from "./+types"
export { action, loader } from "../../../utils/action-loader"

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { summary, highestReceived, mostSweet, totalUsdt } = loaderData

  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  function handleCopy(val: string) {
    navigator.clipboard.writeText(val)
    setCopiedHash(val)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-10">
        <div className="col-span-1">
          <Card
            className="col-span-1"
            title="History"
            color="green"
            actions={
              <ForwardLink to="/history" className="text-inherit">
                View all
              </ForwardLink>
            }
          >
            <Table>
              <TableCaption>A list of your recent transaction.</TableCaption>
              <TableHeader>
                {summary.length > 0 && (
                  <TableRow>
                    <TableHead className="w-[100px]">Tx Hash</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {summary.length > 0 ? (
                  summary.map((val, id) => (
                    <TableRow key={id} className="odd:bg-transparent even:bg-slate-900/10">
                      <TableCell className="font-medium flex flex-row gap-2">
                        {val.transactionHash.slice(0, 10)}...{val.transactionHash?.slice(-8)}
                        {copiedHash === val.transactionHash ? (
                          <p className="italic">Copied!</p>
                        ) : (
                          <Copy
                            className="cursor-pointer"
                            onClick={() => handleCopy(val.transactionHash)}
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {val.amount} {val.tokenType}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center italic text-white/60">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="col-span-1 flex flex-col gap-y-10">
          <Card title="Summary" color="orange">
            <div className="grid grid-cols-2 divide-x-2 gap-5">
              <div className="flex flex-col gap-5 pr-5">
                <p>
                  USDT
                  <br />
                  &asymp;
                </p>
                <p className="text-5xl font-bold">$ {totalUsdt.toFixed(2)}</p>
              </div>

              <div className="flex flex-col gap-5">
                <p>
                  Highest
                  <br />
                  Received
                </p>
                <p className="text-5xl font-bold">{highestReceived} IDRX</p>
              </div>
            </div>
          </Card>

          <Card title="Achievements" color="pink">
            <div className="flex flex-col gap-5 pr-5">
              <p className="text-center">
                Most
                <br />
                Sweet
              </p>
              <p className="text-center text-5xl font-bold">{mostSweet.total} IDRX</p>
              <p className="text-xs text-white/80 text-center">
                Biggest support from <span className="font-semibold">{mostSweet.name}</span>
              </p>
            </div>
          </Card>

          <LogoStaticAnimated />
        </div>
      </div>
    </>
  )
}
