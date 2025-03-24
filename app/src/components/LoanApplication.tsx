/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import LoanApplicationForm from "./LoanApplicationForm";
import { useWallet } from "@/context/WalletProvider";
const LoanApplication = () => {
  const { account } = useWallet();
  const [applicationResult, setApplicationResult] = useState(null); // fix type here

  const handleApplicationSubmit = async (formData: any) => {
    try {
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
      setApplicationResult({
        ...result,
        success: true,
        message: "Application succesffully submitted",
      });
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
        isWalletConnected={!!account}
      />

      {applicationResult && (
        <div
          className={`mt-8 p-4 rounded ${
            applicationResult.success ? "bg-green-100" : "bg-red-100"
          }`}
          onClick={() => setApplicationResult(null)}
        >
          <p className="text-center font-medium">{applicationResult.message}</p>
        </div>
      )}
    </div>
  );
};

export default LoanApplication;
