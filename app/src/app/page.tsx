import WalletConnect from "@/components/WalletConnect";
import LoanApplication from "@/components/LoanApplication";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Loan Application Portal</h1>
        <WalletConnect />
      </header>

      <main className="flex flex-col gap-[32px] items-center">
        <LoanApplication />
      </main>

      <footer className="text-center text-sm text-gray-500">
        Powered by ZK Loan Prediction
      </footer>
    </div>
  );
}
