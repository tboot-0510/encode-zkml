"use client";
import { useState } from "react";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

const WalletConnect = ({ onConnect }: any) => {
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const client = createWalletClient({
          chain: mainnet,
          transport: custom(window.ethereum),
        });

        const [address] = await client.requestAddresses();
        setAccount(address);
        setIsConnected(true);
        onConnect(address);
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div className="wallet-connect">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="connected-status">
          <span className="text-green-500">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
