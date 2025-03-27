/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import LoanApplicationForm from "./LoanApplicationForm";
import { useWallet } from "@/context/WalletProvider";
import * as viem from 'viem';
import { sepolia } from 'viem/chains'

const contractAbi = [{"type":"function","name":"verifyProof","inputs":[{"name":"proof","type":"bytes","internalType":"bytes"},{"name":"instances","type":"uint256[]","internalType":"uint256[]"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"}]

const LoanApplication = () => {
  const { account, walletClient } = useWallet();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleApplicationSubmit = async (formData: any) => {
    try {
      setLoading(true);
      const response = await fetch("/api/process-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account,
          ...formData,
        }),
      });

      const result = await response.json();

      setResult({
        ...result,
        success: true,
        message: "Application successfully submitted.",
      });

      
      const proof = new Uint8Array(result.data.proof.split(","))
      const proofHex = '0x' + Array.from(proof)
        .map(byte => byte.toString(16).padStart(2, '0')) // Convert each byte to a 2-digit hex string
        .join('')

      const witness = Array.from(new Uint8Array(result.data.witness.split(",")));
      console.log(proofHex, witness);
      const data = viem.encodeFunctionData({
        abi: contractAbi,
        functionName: "verifyProof",
        args: [proofHex, witness],
      })
      await walletClient?.sendTransaction({
        account,
        to: "0x03CE79d7B5586dAEFf2CDa53B223bf6Fc7eb0eD4",
        data,
        chain: sepolia
      })
      setLoading(false);
    } catch (error) {
      console.error("Error processing application:", error);
      setLoading(false);
      setResult({
        success: false,
        message: "Error processing your application",
      });
    }
  };

  const generateResultText = (data: any) => {
    const { model_prediction } = data;
    if (model_prediction) {
      return (
        <p className="bg-green-100 p-4 rounded text-black">
          Congratulations! Your loan application has been approved.
        </p>
      );
    } else {
      return (
        <p className="bg-red-100 p-4 rounded text-black">
          We regret to inform you that your loan application has been denied.
        </p>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Loan Application</h1>
      {result?.data && (
        <div className="mt-8 p-4 rounded text-black">
          {generateResultText(result.data)}
        </div>
      )}

      {!result?.data && (
        <LoanApplicationForm
          onSubmit={handleApplicationSubmit}
          isWalletConnected={!!account}
          loading={loading}
        />
      )}
    </div>
  );
};

export default LoanApplication;
