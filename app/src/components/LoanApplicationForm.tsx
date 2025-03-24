import { useState } from "react";

interface LoanApplicationFormProps {
  onSubmit: (formData: typeof initialFormData) => void;
  isWalletConnected: boolean;
}

const initialFormData = {
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
};

interface FormField {
  name: keyof typeof initialFormData;
  label: string;
  type: "select" | "number";
  required: boolean | ((formData: typeof initialFormData) => boolean);
  options?: { value: string; label: string }[];
  showIf?: (formData: typeof initialFormData) => boolean;
}

const formFields: FormField[] = [
  {
    name: "gender",
    label: "Gender",
    type: "select",
    required: true,
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ],
  },
  {
    name: "married",
    label: "Married",
    type: "select",
    required: true,
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  },
  {
    name: "dependents",
    label: "Dependents",
    type: "select",
    required: true,
    options: [
      { value: "0", label: "0" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3+", label: "3+" },
    ],
  },
  {
    name: "education",
    label: "Education",
    type: "select",
    required: true,
    options: [
      { value: "Graduate", label: "Graduate" },
      { value: "Not Graduate", label: "Not Graduate" },
    ],
  },
  {
    name: "selfEmployed",
    label: "Self Employed",
    type: "select",
    required: true,
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  },
  {
    name: "applicantIncome",
    label: "Applicant Income",
    type: "number",
    required: true,
  },
  {
    name: "coapplicantIncome",
    label: "Co-applicant Income",
    type: "number",
    required: (formData) => formData.married === "Yes",
    showIf: (formData) => formData.married === "Yes",
  },
  {
    name: "loanAmount",
    label: "Loan Amount",
    type: "number",
    required: true,
  },
  {
    name: "loanTerm",
    label: "Loan Term (months)",
    type: "number",
    required: true,
  },
  {
    name: "creditHistory",
    label: "Credit History",
    type: "select",
    required: true,
    options: [
      { value: "1", label: "Good" },
      { value: "0", label: "Bad" },
    ],
  },
  {
    name: "propertyArea",
    label: "Property Area",
    type: "select",
    required: true,
    options: [
      { value: "Urban", label: "Urban" },
      { value: "Semiurban", label: "Semiurban" },
      { value: "Rural", label: "Rural" },
    ],
  },
];

const LoanApplicationForm = ({
  onSubmit,
  isWalletConnected,
}: LoanApplicationFormProps) => {
  const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isWalletConnected) {
      alert("Please connect your wallet first!");
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = (formData: typeof initialFormData) => {
    return formFields.every((field) => {
      if (field.showIf && !field.showIf(formData)) return true;

      const isRequired =
        typeof field.required === "function"
          ? field.required(formData)
          : field.required;

      return isRequired ? formData[field.name] !== "" : true;
    });
  };

  const isDisabled = !isWalletConnected || !isFormValid(formData);

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {formFields.map((field) => {
          if (field.showIf && !field.showIf(formData)) return null;

          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required={
                    typeof field.required === "function"
                      ? field.required(formData)
                      : field.required
                  }
                >
                  <option value="">Select...</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required={
                    typeof field.required === "function"
                      ? field.required(formData)
                      : field.required
                  }
                />
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white 
          ${isDisabled ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
      >
        Submit Application
      </button>
    </form>
  );
};

export default LoanApplicationForm;
