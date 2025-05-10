import { createContext, useContext, useState } from "react";
import type { Address } from "viem";
import { useAccount, useConnect, useDisconnect, type Config } from "wagmi";
import type { ConnectMutate } from "wagmi/query";

export interface SugarWalletContextType {
  // isOpen: boolean;
  // setIsOpen: (isOpen: boolean) => void;
  connectors: Config["connectors"];
  connect: ConnectMutate<Config, unknown>;
  disconnect: () => void;
  address: Address;
  isConnected: boolean;
}

const SugarWalletContext = createContext<SugarWalletContextType | null>(null);

export function SugarWalletProvider({ children }: { children: React.ReactNode }) {
  // const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <SugarWalletContext.Provider
      value={{
        // isOpen,
        // setIsOpen,
        address: address as Address,
        isConnected,
        connectors,
        connect,
        disconnect,
      }}
    >
      {children}
    </SugarWalletContext.Provider>
  );
}

export function useSugarWallet() {
  const context = useContext(SugarWalletContext);
  if (!context) {
    throw new Error("useSugarWallet must be used within a SugarWalletProvider");
  }
  return context;
}
