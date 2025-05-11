import { getWalletSession } from "@services/cookie"
import { Button } from "@shadcn/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shadcn/table"
import { Card } from "@sugar/card"
import axios from "axios"
import { Copy } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { useLoaderData } from "react-router"
import type { TransactionItem } from "~/types/TransactionItem"
import { getSocialMetas } from "~/utils/seo"
import type { Route } from "./+types"

export function meta({}: Route.MetaArgs) {
  return [
    ...getSocialMetas({
      title: "History - Sugar",
      description: "History Sugar - Spread sweetness into communities, streamer in web3.",
      path: "/",
    }),
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getWalletSession(request)
  return { address: session }
}

export default function TransactionHistory() {
  const { address } = useLoaderData<typeof loader>()
  const PAGE_SIZE = 5
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null)
  const [incomingData, setIncomingData] = useState<TransactionItem[]>([])
  const [outcomingData, setOutcomingData] = useState<TransactionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [incomingPage, setIncomingPage] = useState(1)
  const [outcomingPage, setOutcomingPage] = useState(1)

  const totalIncomingPages = Math.ceil(incomingData.length / PAGE_SIZE)
  const totalOutcomingPages = Math.ceil(outcomingData.length / PAGE_SIZE)

  const fetchData = async (type: "in" | "out") => {
    const res = await axios.get(`${import.meta.env.VITE_BE_URL}/trx/${address}/${type}?limit=100`)
    return res.data.data
  }

  useEffect(() => {
    Promise.all([fetchData("in"), fetchData("out")]).then(([inData, outData]) => {
      setIncomingData(inData)
      setOutcomingData(outData)
      setLoading(false)
    })
  }, [])

  const paginatedData = (data: TransactionItem[], page: number) => {
    const start = (page - 1) * PAGE_SIZE
    return data.slice(start, start + PAGE_SIZE)
  }

  return (
    <div className="flex flex-col gap-10">
      <Card title="Incoming Sugar 🍭" color="green">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tx Hash</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(PAGE_SIZE)].map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell colSpan={4} className="animate-pulse text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedData(incomingData, incomingPage).length > 0 ? (
              paginatedData(incomingData, incomingPage).map((item, idx) => (
                <TableRow key={idx} onClick={() => setSelectedTx(item)}>
                  <TableCell>{item.transactionHash}</TableCell>
                  <TableCell>{item.from}</TableCell>
                  <TableCell>
                    {item.amount} {item.tokenType}
                  </TableCell>
                  <TableCell>{item.createdAt}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center italic text-white/60">
                  No incoming transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-center mt-6 space-x-2">
          {renderPaginationButtons(totalIncomingPages, incomingPage, setIncomingPage)}
        </div>
      </Card>

      <Card title="Outcoming Sugar 🍬" color="green">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tx Hash</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(PAGE_SIZE)].map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell colSpan={4} className="animate-pulse text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedData(outcomingData, outcomingPage).length > 0 ? (
              paginatedData(outcomingData, outcomingPage).map((item, idx) => (
                <TableRow key={idx} onClick={() => setSelectedTx(item)}>
                  <TableCell>{item.transactionHash}</TableCell>
                  <TableCell>{item.creator}</TableCell>
                  <TableCell>
                    {item.amount} {item.tokenType}
                  </TableCell>
                  <TableCell>{item.createdAt}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center italic text-white/60">
                  No outcoming transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-center mt-6 space-x-2">
          {renderPaginationButtons(totalOutcomingPages, outcomingPage, setOutcomingPage)}
        </div>
      </Card>

      <AnimatePresence>
        {selectedTx && <DialogDetail selectedTx={selectedTx} onClose={() => setSelectedTx(null)} />}
      </AnimatePresence>
    </div>
  )
}

function renderPaginationButtons(
  totalPages: number,
  currentPage: number,
  handlePageChange: (page: number) => void
) {
  return Array.from({ length: totalPages }, (_, i) => {
    const page = i + 1
    return (
      <Button
        key={page}
        className={
          currentPage === page
            ? "bg-blue text-white"
            : "bg-transparent text-white hover:bg-blue shadow-none"
        }
        onClick={() => handlePageChange(page)}
      >
        {page}
      </Button>
    )
  })
}

function DialogDetail({
  selectedTx,
  onClose,
}: {
  selectedTx: TransactionItem
  onClose: () => void
}) {
  const [isCopied, setIsCopied] = useState(false)
  function handleCopy(val: string) {
    navigator.clipboard.writeText(val)
    setIsCopied(true)
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <Card
          title="🎉 Transaction Details 🎉"
          color="pink"
          className="max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-4 text-white">
            <p className="text-sm font-bold flex justify-between">
              Donor: <span className="font-mono font-normal">{selectedTx.from}</span>
            </p>
            <p className="text-sm font-bold flex justify-between">
              Creator:
              <span className="font-mono font-normal flex gap-2 items-center">
                {selectedTx.creator.slice(0, 6)}...{selectedTx.creator.slice(-4)}
                {isCopied ? (
                  <p className="italic">Copied!</p>
                ) : (
                  <Copy className="cursor-pointer" onClick={() => handleCopy(selectedTx.creator)} />
                )}
              </span>
            </p>
            <p className="text-sm font-bold flex justify-between">
              Amount:{" "}
              <span className="font-mono font-normal">
                {selectedTx.amount} {selectedTx.tokenType}
              </span>
            </p>
            <p className="text-sm font-bold flex justify-between">
              Date: <span className="font-mono font-normal">{selectedTx.createdAt}</span>
            </p>
            <p className="text-sm font-bold flex justify-between">
              Transaction Hash:{" "}
              <span className="font-mono font-normal flex gap-2 items-center">
                {selectedTx.transactionHash.slice(0, 6)}...{selectedTx.transactionHash.slice(-4)}
                {isCopied ? (
                  <p className="italic">Copied!</p>
                ) : (
                  <Copy
                    className="cursor-pointer"
                    onClick={() => handleCopy(selectedTx.transactionHash)}
                  />
                )}
              </span>
            </p>
          </div>
          <Button className="mt-6 w-full font-bold py-2 rounded-lg" onClick={onClose}>
            Close 🚀
          </Button>
        </Card>
      </motion.div>
    </div>
  )
}
