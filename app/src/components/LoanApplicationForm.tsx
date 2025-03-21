import { useState } from "react";

const LoanApplicationForm = ({ onSubmit, isWalletConnected }: any) => {
  const [formData, setFormData] = useState({
    gender: "",
    married: "",
    dependents: "",
    education: "",
    selfEmployed: "",
    applicantIncome: "",
    coapplicantIncome: "",
    loanAmount: "",
    loanTerm: "",
    creditHistory: "",
    propertyArea: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isWalletConnected) {
      alert("Please connect your wallet first!");
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Married
          </label>
          <select
            name="married"
            value={formData.married}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dependents
          </label>
          <select
            name="dependents"
            value={formData.dependents}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Select...</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3+">3+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Education
          </label>
          <select
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Select...</option>
            <option value="Graduate">Graduate</option>
            <option value="Not Graduate">Not Graduate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Self Employed
          </label>
          <select
            name="selfEmployed"
            value={formData.selfEmployed}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Applicant Income
          </label>
          <input
            type="number"
            name="applicantIncome"
            value={formData.applicantIncome}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Co-applicant Income
          </label>
          <input
            type="number"
            name="coapplicantIncome"
            value={formData.coapplicantIncome}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Loan Amount
          </label>
          <input
            type="number"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Loan Term (months)
          </label>
          <input
            type="number"
            name="loanTerm"
            value={formData.loanTerm}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Credit History
          </label>
          <select
            name="creditHistory"
            value={formData.creditHistory}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Select...</option>
            <option value="1">Good</option>
            <option value="0">Bad</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Property Area
          </label>
          <select
            name="propertyArea"
            value={formData.propertyArea}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Select...</option>
            <option value="Urban">Urban</option>
            <option value="Semiurban">Semiurban</option>
            <option value="Rural">Rural</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isWalletConnected}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white 
          ${
            isWalletConnected
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400"
          }`}
      >
        Submit Application
      </button>
    </form>
  );
};

export default LoanApplicationForm;
