import { createClient, http } from "viem"
import { type Config, createConfig } from "wagmi"
import { injected, metaMask } from "wagmi/connectors"
import { XellarKitProvider, defaultConfig, darkTheme } from "@xellar/kit"
import { liskSepolia, sepolia } from "viem/chains"

export const WAGMI_CONFIG = createConfig({
  chains: [sepolia],
  connectors: [injected(), metaMask()],
  ssr: true,
  transports: {
    [sepolia.id]: http("https://sepolia.infura.io/v3/ff13c1b25d9f4e939b5143372e0f5f41"),
  },
  // client({ chain }) {
  //   return createClient({ chain, transport: http() });
  // },
})

export const WAGMI_XELLAR_CONFIG = defaultConfig({
  appName: "Sugar",
  walletConnectProjectId: "702bd4efaeffd9a2a114b75acc3cc307",
  xellarAppId: "bb2e8da5-2b62-4288-8297-c2f68a84a076",
  xellarEnv: "sandbox",
  chains: [
    liskSepolia,
    // sepolia,
  ],
  ssr: true,
}) satisfies Config
