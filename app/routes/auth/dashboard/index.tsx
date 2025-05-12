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
export { loader } from "./utils/action-loader"

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-x-10">
        <div className="col-span-1">
          <Card
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
                  summary.slice(0, 9).map((val, id) => (
                    <TableRow key={id} className="odd:bg-transparent even:bg-slate-900/10">
                      <TableCell className="font-medium">
                        <div className="flex flex-row items-center gap-2 w-full">
                          <span className="truncate max-w-[200px] flex-1 whitespace-nowrap">
                            {val.transactionHash.slice(0, 16)}...{val.transactionHash.slice(-10)}
                          </span>
                          {copiedHash === val.transactionHash ? (
                            <p className="italic text-xs text-green-400">Copied!</p>
                          ) : (
                            <Copy
                              className="cursor-pointer shrink-0"
                              onClick={() => handleCopy(val.transactionHash)}
                            />
                          )}
                        </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x gap-5">
              <div className="flex flex-col gap-2 sm:pr-5 items-center sm:items-start text-center sm:text-left">
                <p>
                  USDT
                  <br />
                  &asymp;
                </p>
                <p className="text-4xl sm:text-5xl font-bold">$ {totalUsdt.toFixed(2)}</p>
              </div>

              <div className="flex flex-col gap-2 pt-5 sm:pt-0 items-center sm:items-start text-center sm:text-left">
                <p>
                  Highest
                  <br />
                  Received
                </p>
                <p className="text-4xl sm:text-5xl font-bold">{highestReceived} IDRX</p>
              </div>
            </div>
          </Card>

          <Card title="Achievements" color="pink">
            <div className="flex flex-col gap-5 text-center">
              <p>
                Most
                <br />
                Sweet
              </p>
              <p className="text-4xl sm:text-5xl font-bold">{mostSweet.total} IDRX</p>
              <p className="text-xs text-white/80">
                Biggest support from <span className="font-semibold">{mostSweet.name}</span>
              </p>
            </div>
          </Card>

          <div className="self-center">
            <LogoStaticAnimated />
          </div>
        </div>
      </div>
    </>
  )
}
