import { getWalletSession } from "@services/cookie"
import { Alert, AlertDescription, AlertTitle } from "@shadcn/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs"
import { ButtonMagnet } from "@sugar/button"
import axios from "axios"
import { Check, Copy } from "lucide-react"
import { useEffect, useState } from "react"
import { redirect, useFetcher, useLoaderData } from "react-router"
import { getSocialMetas } from "~/utils/seo"
import type { Route } from "./+types"

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

  await axios.get(`${process.env.VITE_BE_URL}/dev/${jsonData.type}/${session}/USDC`).catch(() => {})

  return { success: true }
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getWalletSession(request)

  const isSetUsername = await axios.post(`${process.env.VITE_BE_URL}/account/check`, {
    address: session,
  })

  if (!isSetUsername.data.success) {
    return redirect("/profile")
  }

  return { address: isSetUsername.data.address }
}

export default function OverlaysPage() {
  const fetcher = useFetcher()
  const loaderData = useLoaderData<typeof loader>()
  const { address: addressSession } = loaderData

  const [isCopied, setIsCopied] = useState(false)
  const [isSuccedTest, setIsSuccedTest] = useState(false)

  const tabs = ["alerts", "mediashare"]

  function testNotification(val: string) {
    fetcher.submit({ type: val }, { method: "POST" })
  }

  function handleCopy(val: string) {
    navigator.clipboard.writeText(val)
    setIsCopied(true)
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [isCopied])

  useEffect(() => {
    if (fetcher.data) {
      setIsSuccedTest(true)
      const timer = setTimeout(() => setIsSuccedTest(false), 2000)
      return () => clearTimeout(timer)
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
        <TabsList className="w-full mb-5 flex flex-wrap gap-2">
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
              <div className="relative rounded-lg border border-blue p-5">
                <div className="overflow-x-auto whitespace-nowrap pr-10 text-sm sm:text-base italic">
                  https://sugarhub.space/{val}?address={addressSession}
                </div>
                <div className="absolute top-5 right-5 bg-black px-1 rounded-md shadow-sm">
                  {isCopied ? (
                    <p className="italic text-green-400 text-sm">Copied!</p>
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
            </div>

            <div className="flex justify-end">
              <ButtonMagnet onClick={() => testNotification(val)} className="capitalize w-max">
                Test {val}
              </ButtonMagnet>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}
