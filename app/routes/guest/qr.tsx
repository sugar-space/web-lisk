import { redirect, useLoaderData } from "react-router"
import type { Route } from "./+types/mediashare"
import axios from "axios"
import { getSocialMetas } from "~/utils/seo"
import { QRCodeCanvas } from "qrcode.react"

import "./overlay.css"
import { ClientOnly } from "remix-utils/client-only"

export function meta({}: Route.MetaArgs) {
  return [
    ...getSocialMetas({
      title: "QR Code - Sugar",
      description: "QR Code Sugar - Spread sweetness into communities, streamer in web3.",
      path: "/qr",
    }),
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const address = url.searchParams.get("address")

  const isProfileActive = await axios.post(`${process.env.VITE_BE_URL}/account/check`, {
    address: address,
  })

  if (isProfileActive.data.success) {
    return {
      username: isProfileActive.data.username,
    }
  } else {
    return redirect("/profile")
  }
}

export default function Mediashare() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <ClientOnly>
      {() => (
        <div className="p-12 bg-transparent h-screen">
          <div className="text-4xl w-max flex flex-col gap-8 items-center text-center bg-pink p-4 rounded-xl shadow-[0.6rem_0.6rem_0_#ec003f]">
            <div className="flex flex-wrap justify-center gap-2 bg-white rounded-lg p-4">
              <QRCodeCanvas
                value={`https://sugarhub.space/${loaderData.username}`}
                size={300}
                level="Q"
                imageSettings={{
                  src: "https://sugarhub.space/sugar.png",
                  height: 80,
                  width: 80,
                  excavate: false,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </ClientOnly>
  )
}
