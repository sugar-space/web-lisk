import { getWalletSession } from "@services/cookie"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs"
import axios from "axios"
import { AlertCircle, Check, Copy } from "lucide-react"
import { redirect, useActionData, useFetcher, useLoaderData } from "react-router"
import type { Route } from "./+types"
import { useEffect, useState } from "react"
import { ButtonMagnet } from "@sugar/button"
import { Alert, AlertDescription, AlertTitle } from "@shadcn/alert"
import { getSocialMetas } from "~/utils/seo"

export function meta({}: Route.MetaArgs) {
  return [
    ...getSocialMetas({
      title: "Overlay - Sugar",
      description: "Overlay Sugar - Spread sweetness into communities, streamer in web3.",
      path: "/",
    }),
  ]
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") return

  const body = await request.formData()
  const jsonData = Object.fromEntries(body.entries())
  const session = await getWalletSession(request)

  console.log(`${process.env.VITE_BE_URL}/dev/${jsonData.type}/${session}/USDC`)

  await axios.get(`${process.env.VITE_BE_URL}/dev/${jsonData.type}/${session}/USDC`).then().catch()

  return {
    success: true,
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getWalletSession(request)

  const isSetUsername = await axios.post(`${process.env.VITE_BE_URL}/account/check`, {
    address: session,
  })

  if (!isSetUsername.data.success) {
    return redirect("/profile")
  } else {
    return {
      address: isSetUsername.data.address,
    }
  }
}

export default function OverlaysPage() {
  const fetcher = useFetcher()
  const loaderData = useLoaderData<typeof loader>()
  const { address: addressSession } = loaderData

  const [isCopied, setIsCopied] = useState(false)
  const [isSuccedTest, setIsSuccedTest] = useState(false)

  const tabs = [
    "alerts",
    "mediashare",
    // "milestone-WIP",
    // "leaderboard-WIP",
    // "auction-WIP",
    // "voting-WIP",
  ]

  function testNotification(val: string) {
    fetcher.submit({ type: val }, { method: "POST" })
  }

  function handleCopy(val: string) {
    navigator.clipboard.writeText(val)
    setIsCopied(true)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setIsCopied(false)
      clearInterval(timer)
    }, 1000 * 1.5)
  }, [isCopied])

  useEffect(() => {
    if (fetcher.data) {
      setIsSuccedTest(true)

      const timer = setInterval(() => {
        setIsSuccedTest(false)
        clearInterval(timer)
      }, 1000 * 2)
    }
  }, [fetcher.data])

  return (
    <>
      {isSuccedTest && (
        <Alert variant={"green"} className="mb-5">
          <Check className="h-4 w-4" />
          <AlertTitle>Succeed</AlertTitle>
          <AlertDescription>Sending test notification!</AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="alerts">
        <TabsList className="w-full mb-5">
          {tabs.map((val, i) => (
            <TabsTrigger key={i} value={val} className="capitalize">
              {val}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((val, i) => (
          <TabsContent key={i} value={val} className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <p className="font-semibold">Widget URL</p>
              <div className="flex flex-row justify-between items-center rounded-lg border border-blue p-5">
                <p className="italic">
                  https://sugarhub.space/{val}?address={addressSession}
                </p>
                {isCopied ? (
                  <p className="italic">Copied!</p>
                ) : (
                  <Copy
                    className="cursor-pointer"
                    onClick={() =>
                      handleCopy(`https://sugarhub.space/${val}?address=${addressSession}`)
                    }
                  />
                )}
              </div>
            </div>
            <div className="flex flex-row justify-end">
              <ButtonMagnet onClick={() => testNotification(val)} className="capitalize w-max">
                Test {val}
              </ButtonMagnet>
            </div>
            {/* <p className=" italic">soon settings dialog here</p> */}
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}
