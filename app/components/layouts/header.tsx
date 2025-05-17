import { LogoStaticAnimated } from "@sugar/logo-static-animated"
import { ConnectWalletXellar } from "@sugar/wallet/connect-wallet-xellar"
import type { JSX } from "react"
import { cn } from "~/utils/cn"

export function Header({ className }: JSX.IntrinsicElements["div"]) {
  return (
    <div
      className={cn(
        "absolute lg:fixed left-0 w-full py-6 px-4 sm:px-6 md:px-10 z-20 backdrop-blur-md",
        className
      )}
    >
      <div className="flex flex-nowrap items-center justify-between w-full gap-4 overflow-x-auto">
        <LogoStaticAnimated className="h-8 w-auto flex-shrink-0" />
        <div className="flex-shrink-0">
          <ConnectWalletXellar />
        </div>
      </div>
    </div>
  )
}
