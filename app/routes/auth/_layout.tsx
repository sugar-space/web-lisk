import { getWalletSession } from "@services/cookie"
import { ConnectWalletXellar } from "@sugar/wallet/connect-wallet-xellar"
import axios from "axios"
import { Outlet, redirect, useLoaderData } from "react-router"
import type { Route } from "../+types/_layout"
import { BottomMenu } from "./bottom-menu"

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getWalletSession(request)
  if (!session) return redirect("/")

  const isSetUsername = await axios.post(`${process.env.VITE_BE_URL}/account/check`, {
    address: session,
  })

  return {
    username: isSetUsername.data.success ? `${isSetUsername.data.username} 🍭` : session,
  }
}

export default function LayoutAuth() {
  const loaderData = useLoaderData<typeof loader>()
  const { username } = loaderData

  return (
    <>
      <div className="container h-screen px-4 sm:px-6 lg:px-[50px] py-[45px] flex flex-col gap-10">
        <div className="flex flex-wrap justify-between items-center gap-4 min-w-0">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-4xl sm:text-5xl lg:text-6xl truncate">Hi! 👋</p>
            <p className="text-lg sm:text-xl truncate">{username}</p>
          </div>
          <div className="flex-shrink-0">
            <ConnectWalletXellar />
          </div>
        </div>
        <div className="pb-48">
          <Outlet />
        </div>
      </div>
      <BottomMenu />
    </>
  )
}
