/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useCallback, useState } from "react";
import {
  createPublicClient,
  http,
  createWalletClient,
  custom,
  PublicClient,
  WalletClient,
} from "viem";
import { mainnet } from "viem/chains";

interface WalletContextType {
  account: `0x${string}` | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  publicClient: PublicClient | null;
  walletClient: WalletClient | null;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  isConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  publicClient: null,
  walletClient: null,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = useState<`0x${string}` | null>(null);
  const [publicClient, setPublicClient] = useState<PublicClient | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use this feature");
      return;
    }

    try {
      const publicClient = createPublicClient({
        chain: mainnet,
        transport: http(),
      });
      setPublicClient(publicClient);

      const walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum),
      });
      setWalletClient(walletClient);

      const [address] = await walletClient.requestAddresses();
      setAccount(address);

      window.ethereum.on("accountsChanged", (newAccounts: `0x${string}`[]) => {
        setAccount(newAccounts[0] || null);
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet");
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setPublicClient(null);
    setWalletClient(null);
  }, []);

  const value = {
    account,
    isConnected: !!account,
    connectWallet,
    disconnectWallet,
    publicClient,
    walletClient,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: any) => void;
      removeListener: (event: string, callback: any) => void;
    };
  }
}
