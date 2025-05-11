import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@shadcn/dropdown-menu"
import { ButtonMagnet, ButtonMagnetVariantsVal, type ButtonMagnetVariants } from "@sugar/button"
import { Icon } from "@sugar/icon"
import { ConnectButton, useConnectModal } from "@xellar/kit"
import axios from "axios"
import { ChevronDown, LogOut } from "lucide-react"
import { useEffect, useMemo } from "react"
import { NavLink, useSubmit } from "react-router"
import { ClientOnly } from "remix-utils/client-only"
import { liskSepolia } from "viem/chains"
import { useAccount, useSwitchChain } from "wagmi"
import { useSugarWallet } from "./provider"

export function ConnectWalletXellar() {
  const FIXED_CHAIN = liskSepolia.id
  const submit = useSubmit()
  const { open: openModalXellar } = useConnectModal()
  const { isConnected, address, disconnect } = useSugarWallet()

  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const isWrongNetwork = isConnected && chain?.id !== FIXED_CHAIN

  const getColor = useMemo<ButtonMagnetVariants["color"]>(() => {
    const idx = Math.floor(Math.random() * ButtonMagnetVariantsVal.length)
    return ButtonMagnetVariantsVal[idx] as ButtonMagnetVariants["color"]
  }, [])

  async function handleDisconnect() {
    disconnect()
    submit(
      {
        disconnect: "",
      },
      {
        action: "/connect",
        method: "post",
        encType: "application/json",
      }
    )
  }

  useEffect(() => {
    if (isConnected && address) {
      axios.post("/connect", {
        address,
      })
    }
  }, [isConnected, address])

  return (
    <ConnectButton.Custom
      children={() => (
        <>
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <ClientOnly>
                    {() => (
                      <ButtonMagnet color={isWrongNetwork ? "yellow" : "orange"}>
                        <div className="flex flex-row items-center gap-4">
                          {isWrongNetwork ? (
                            "Wrong Network"
                          ) : (
                            <>
                              {chain?.name} ~ {`${address.slice(0, 6)}...${address?.slice(-4)}`}
                              <ChevronDown className="size-4 transition-transform" />
                            </>
                          )}
                        </div>
                      </ButtonMagnet>
                    )}
                  </ClientOnly>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isWrongNetwork && (
                  <DropdownMenuItem
                    className="py-4"
                    onClick={() => switchChain?.({ chainId: FIXED_CHAIN })}
                  >
                    Change Network
                    <DropdownMenuShortcut>
                      <Icon name="reload" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                )}
                <NavLink to="/dashboard">
                  <DropdownMenuItem className="py-4">
                    Dashboard
                    <DropdownMenuShortcut>
                      <Icon name="home" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </NavLink>
                <NavLink to="/overlays">
                  <DropdownMenuItem className="py-4">
                    Overlays
                    <DropdownMenuShortcut>
                      <Icon name="desktop" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </NavLink>
                <NavLink to="/profile">
                  <DropdownMenuItem className="py-4">
                    Profile
                    <DropdownMenuShortcut>
                      <Icon name="profile" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </NavLink>
                <DropdownMenuItem className="py-4" onClick={handleDisconnect}>
                  Log out
                  <DropdownMenuShortcut>
                    <LogOut />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <ButtonMagnet color={getColor ?? "orange"} onClick={openModalXellar}>
              Connect Wallet
            </ButtonMagnet>
          )}
        </>
      )}
    />
  )
}
