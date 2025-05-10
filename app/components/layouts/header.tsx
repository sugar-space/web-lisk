import { LogoStaticAnimated } from "@sugar/logo-static-animated";
import { ConnectWalletXellar } from "@sugar/wallet/connect-wallet-xellar";
import type { JSX } from "react";
import { cn } from "~/utils/cn";

export function Header({ className }: JSX.IntrinsicElements["div"]) {
  return (
    <div
      className={cn(
        "absolute lg:fixed left-0 w-full py-[10px] md:py-[25px] px-[50px] z-20 backdrop-blur-md",
        className
      )}
    >
      <div className="flex flex-row w-full justify-between items-center">
        <LogoStaticAnimated className="h-8 w-max" />
        <ConnectWalletXellar />
      </div>
    </div>
  );
}
