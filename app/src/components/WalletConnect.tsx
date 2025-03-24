"use client";

import { useWallet } from "@/context/WalletProvider";

const WalletConnect = () => {
  const { account, isConnected, connectWallet } = useWallet();

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
            Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
          </span>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
