// import type { Route } from "./+types/donate-by-username";
import { ButtonMagnet } from "@sugar/button"
import { ChevronDown } from "lucide-react"
import { Input } from "@shadcn/input"
import { InputAmount } from "@sugar/input-amount"
import { Textarea } from "@shadcn/textarea"
import { LogoStaticAnimated } from "@sugar/logo-static-animated"
import axios from "axios"
import { useEffect, useState } from "react"
import { ClientOnly } from "remix-utils/client-only"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@shadcn/drawer"
import { ButtonArrow } from "@sugar/button/arrow"
import BN from "bn.js"
import { ABI } from "~/constants/ABI"
import { parseEther } from "viem"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { Alert, AlertTitle, AlertDescription } from "@shadcn/alert"
import { AlertCircle, Check } from "lucide-react"
import type { Route } from "./+types"
import { COINS, type CoinItemType } from "~/constants/coins"
import { CONTRACT_ADDRESS } from "~/constants/CA"
import { getSocialMetas } from "~/utils/seo"
import { ConnectWalletXellar } from "@sugar/wallet/connect-wallet-xellar"
import { useSugarWallet } from "@sugar/wallet/provider"

export { loader } from "./loader"

export function meta({ data }: Route.MetaArgs) {
  return [
    ...getSocialMetas({
      title: `${data.creator.username} - Sugar`,
      description: `${data.creator.username} Sugar - Spread sweetness into communities, streamer in web3.`,
      path: "/" + data.creator.username,
      image: data.creator.avatar,
    }),
  ]
}

export default function ({ loaderData }: Route.ComponentProps) {
  const { from, creator, filteredTokens } = loaderData
  const [isOpen, setIsOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState(COINS[0])
  const [isApproved, setIsApproved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { address: addressConnected } = useSugarWallet()

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info"
    title: string
    description: string
  } | null>(null)

  const [form, setForm] = useState({
    from: from.isAlreadySetUsername ? from.username : "Someone",
    creator: creator.address,
    amount: 0,
    message: "",
    mediashare: "",
  })

  function handleTokenSelect(token: CoinItemType) {
    setSelectedToken(token)
    setIsOpen(false)
  }

  /* ------------------------ fetch // axios to backend ----------------------- */
  async function saveTransaction(sendHash: string) {
    try {
      await axios
        .post(`${import.meta.env.VITE_BE_URL}/trx`, {
          amount: form.amount,
          tokenType: selectedToken.symbol,
          creator: creator.address,
          fromAddress: addressConnected,
          from: form.from,
          message: form.message,
          mediashare: form.mediashare,
          type: "in",
          transactionHash: sendHash,
        })
        .then(() => {
          setForm(() => {
            return {
              from: from.isAlreadySetUsername ? from.username + " 🍭" : "Someone",
              creator: creator.address,
              amount: 0,
              message: "",
              mediashare: "",
            }
          })
        })
      console.log("Transaction saved to API")
    } catch (error) {
      console.error("Failed to save transaction to API:", error)
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                             Native Token -> ETH                            */
  /* -------------------------------------------------------------------------- */
  const { data: sendHash, writeContract: writeEthDonate, isPending: isSending } = useWriteContract()

  const { data: ethReceipt, isLoading: isWaitingForEth } = useWaitForTransactionReceipt({
    hash: sendHash,
  })

  // do writeContract donation Native Token ETH
  async function onSubmit() {
    if (!form.from || form.amount <= 0 || !creator.address) {
      setAlert({
        type: "error",
        title: "Validation Error",
        description: "Please fill in all fields correctly.",
      })
      return
    }

    try {
      if (selectedToken.token_address === "0x0000000000000000000000000000000000000000") {
        const value = parseEther(form.amount.toString())

        writeEthDonate({
          abi: ABI,
          address: CONTRACT_ADDRESS,
          functionName: "donate",
          args: [creator.address, selectedToken.token_address, value.toString()],
          value: value,
        })
      }
    } catch (error) {
      setAlert({
        type: "error",
        title: "Donation Failed",
        description: "Donation failed. Please try again.",
      })
    }
  }

  useEffect(() => {
    if (ethReceipt?.status === "success") {
      setAlert({
        type: "success",
        title: "Donation Successful",
        description: "Your donation was successful!",
      })
    }

    if (sendHash) {
      saveTransaction(sendHash)
    }
  }, [ethReceipt])

  /* -------------------------------------------------------------------------- */
  /*                                 ERC20 Token                                */
  /* -------------------------------------------------------------------------- */
  const {
    data: approveHash,
    writeContract: writeApprove,
    isPending: isApproving,
  } = useWriteContract()

  const { data: donateHash, writeContract: writeDonate, isPending: isDonating } = useWriteContract()

  const { data: approveReceipt, isLoading: isWaitingForApproval } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  const { data: donateReceipt, isLoading: isWaitingForDonation } = useWaitForTransactionReceipt({
    hash: donateHash,
  })

  async function handleApprove() {
    if (!selectedToken.token_address || form.amount <= 0) {
      setAlert({
        type: "error",
        title: "Validation Error",
        description: "Please fill in all fields correctly.",
      })
      return
    }

    if (selectedToken.token_address === "0x0000000000000000000000000000000000000000") {
      setAlert({
        type: "info",
        title: "No Approval Needed",
        description: "No approval is needed for ETH.",
      })
      return
    }

    try {
      const amountInWei = new BN(form.amount).mul(new BN(10).pow(new BN(selectedToken.decimals)))

      writeApprove({
        abi: ABI,
        address: selectedToken.token_address as `0x${string}`,
        functionName: "approve",
        args: [CONTRACT_ADDRESS, amountInWei.toString()],
      })
    } catch (error) {
      setAlert({
        type: "error",
        title: "Approval Failed",
        description: "Approval failed. Please try again.",
      })
    }
  }

  // watch approval succeed or not
  useEffect(() => {
    if (approveReceipt?.status === "success" && !isApproved) {
      setAlert({
        type: "success",
        title: "Approval Successful",
        description: "Your approval was successful!",
      })
      setIsApproved(true)
    }
  }, [approveReceipt])

  // watch receipt 'approval', then do writeContract donation ERC20
  useEffect(() => {
    if (isApproved && approveReceipt?.status === "success") {
      const amountInWei = new BN(form.amount).mul(new BN(10).pow(new BN(selectedToken.decimals)))

      writeDonate({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "donate",
        args: [creator.address, selectedToken.token_address, amountInWei.toString()],
      })

      setIsApproved(false)
    }
  }, [isApproved, approveReceipt])

  // watch donation receipt status
  useEffect(() => {
    if (donateReceipt?.status === "success") {
      setAlert({
        type: "success",
        title: "Donation Successful",
        description: "Your donation was successful!",
      })
    }

    if (donateHash) {
      saveTransaction(donateHash)
    }
  }, [donateReceipt])

  /* -------------------------------------------------------------------------- */
  /*                             loading management                             */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    setIsLoading(
      isApproving ||
        isDonating ||
        isSending ||
        isWaitingForApproval ||
        isWaitingForDonation ||
        isWaitingForEth
    )
  }, [
    isApproving,
    isDonating,
    isSending,
    isWaitingForApproval,
    isWaitingForDonation,
    isWaitingForEth,
  ])

  return (
    <div className="container relative px-[20px] lg:px-[50px] py-16 h-screen justify-items-center">
      <div className="flex flex-col gap-8 2xl:w-1/2 pb-20">
        <div className="flex flex-row justify-end">
          <ConnectWalletXellar />
        </div>
        <div className="flex flex-row justify-center my-8 lg:justify-start lg:mt-0">
          <LogoStaticAnimated className="h-20 xl:h-24 w-max as" />
        </div>
        {alert && (
          <Alert
            variant={
              alert.type === "success" ? "green" : alert.type === "error" ? "destructive" : "orange"
            }
          >
            {alert.type === "success" ? (
              <Check className="h-4 w-4" />
            ) : alert.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
          </Alert>
        )}
        <div className="p-5 border border-white/40 rounded-xl flex flex-row items-center gap-6">
          <img src={creator.avatar} className="rounded-full size-20" />
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-bold">{creator.username}</p>
            <p className="text-xs">{creator.address}</p>
            <p className="tracking-wider">{creator.bio}</p>
          </div>
        </div>
        <div className="p-5 border border-white/40 rounded-xl flex flex-row items-center">
          <div className="flex flex-col gap-2 grow">
            <InputAmount
              placeholder="0"
              value={form.amount}
              onChange={(e) =>
                setForm((prev) => {
                  return { ...prev, amount: Number(e.target.value) }
                })
              }
            />
            <p className="px-3">$0</p>
          </div>
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <ClientOnly>
              {() => (
                <ButtonMagnet color="blue" className="px-2 py-2" onClick={() => setIsOpen(true)}>
                  <div className="flex flex-row gap-2 items-center">
                    <img src={selectedToken.icon} className="rounded-full size-12" />
                    <p>{selectedToken.symbol}</p>
                    <ChevronDown />
                  </div>
                </ButtonMagnet>
              )}
            </ClientOnly>
            <DrawerContent className="pb-10">
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle className="text-center font-bold">Select a Token</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col gap-10">
                  {filteredTokens.map((token, i) => (
                    <ButtonArrow
                      key={i}
                      direction="left"
                      className="w-max"
                      iconB64={token.icon}
                      onClick={() => handleTokenSelect(token)}
                    >
                      {token.symbol}
                    </ButtonArrow>
                  ))}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        <div className="border border-white/40 rounded-xl flex flex-col gap-2 p-5">
          <p>From:</p>
          {from.isAlreadySetUsername && (
            <p className="rounded-md bg-transparent px-3 py-1 text-base shadow-xs italic">
              {from.username + " 🍭"}
            </p>
          )}
          {!from.isAlreadySetUsername && (
            <Input
              placeholder="from"
              className="dark:bg-transparent focus-visible:ring-0 placeholder:text-white/70 border-white/70 focus-visible:border-white md:text-lg h-max"
              type="text"
              value={form.from}
              onChange={(e) =>
                setForm((prev) => {
                  return { ...prev, from: e.target.value }
                })
              }
            />
          )}
        </div>

        <div className="border border-white/40 rounded-xl flex flex-col gap-2 p-5">
          <p>Message:</p>
          <Textarea
            placeholder="message"
            className="resize-none dark:bg-transparent focus-visible:ring-0 placeholder:text-white/70 border-white/70 focus-visible:border-white md:text-lg h-max"
            value={form.message}
            onChange={(e) =>
              setForm((prev) => {
                return { ...prev, message: e.target.value }
              })
            }
          />
        </div>

        <div className="border border-white/40 rounded-xl flex flex-col gap-2 p-5">
          <p>Mediashare:</p>
          <Input
            placeholder="https://www.youtube.com/....."
            className="resize-none dark:bg-transparent focus-visible:ring-0 placeholder:text-white/70 border-white/70 focus-visible:border-white md:text-lg h-max"
            value={form.mediashare}
            onChange={(e) =>
              setForm((prev) => {
                return { ...prev, mediashare: e.target.value }
              })
            }
          />
        </div>

        <ButtonMagnet
          color="green"
          size="lg"
          onClick={
            selectedToken.token_address === "0x0000000000000000000000000000000000000000"
              ? onSubmit
              : handleApprove
          }
          disabled={isLoading}
        >
          {isLoading
            ? "Processing..."
            : selectedToken.token_address === "0x0000000000000000000000000000000000000000"
            ? "Donate"
            : "Approve and Donate"}
        </ButtonMagnet>
      </div>
    </div>
  )
}
