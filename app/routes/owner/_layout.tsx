import { Outlet } from "react-router"
import { BottomMenu } from "../auth/bottom-menu"
import { ConnectWalletXellar } from "@sugar/wallet/connect-wallet-xellar"

export default function LayoutAuth() {
  return (
    <>
      <div className="container h-screen px-[20px] lg:px-[50px] py-[45px] flex flex-col gap-10">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="text-6xl">Hi! 👋</p>
            <p className="text-xl">King 👑</p>
          </div>
          <ConnectWalletXellar />
        </div>
        <div className="pb-48 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
      <BottomMenu />
    </>
  )
}
