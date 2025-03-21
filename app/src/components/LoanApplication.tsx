"use client";
import { useState } from "react";
import WalletConnect from "./WalletConnect";
import LoanApplicationForm from "./LoanApplicationForm";

const LoanApplication = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [applicationResult, setApplicationResult] = useState(null);

  const handleWalletConnect = (address) => {
    setIsWalletConnected(true);
    setWalletAddress(address);
  };

  const handleApplicationSubmit = async (formData) => {
    try {
      const response = await fetch("/api/process-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          ...formData,
        }),
      });

      const result = await response.json();
      setApplicationResult(result);
    } catch (error) {
      console.error("Error processing application:", error);
      setApplicationResult({
        success: false,
        message: "Error processing your application",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Loan Application</h1>

      <LoanApplicationForm
        onSubmit={handleApplicationSubmit}
        isWalletConnected={isWalletConnected}
      />

      {applicationResult && (
        <div
          className={`mt-8 p-4 rounded ${
            applicationResult.success ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <p className="text-center font-medium">{applicationResult.message}</p>
        </div>
      )}
    </div>
  );
};

export default LoanApplication;
