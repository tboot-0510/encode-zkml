/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import * as fs from "fs/promises";

const min_scale_values = [
  12.24744871391589, 0.0, 3.0, 12.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0,
];
const max_scale_values = [
  284.60498941515414, 204.12496172687946, 26.457513110645905, 480.0, 1.0, 1.0,
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
];

const convertStringToNumber = (value: string) => {
  const categoryMappings: { [key: string]: number } = {
    // Gender
    Male: 1,
    Female: 0,
    // Married & Self Employed
    Yes: 1,
    No: 0,
    // Education
    Graduate: 1,
    "Not Graduate": 0,
    // Property Area
    Urban: 2,
    Semiurban: 1,
    Rural: 0,
    // Dependents (already numbers except 3+)
    "3+": 3,
  };

  return categoryMappings[value] ?? Number(value);
};

function readLargeFile(filePath: string) {
  return new Promise((resolve, reject) => {
    const chunks: any[] = []; // This will hold the full file content as a string

    const readStream = fs.createReadStream(filePath, {
      highWaterMark: 1024 * 1024,
    }); // 1MB chunks

    readStream.on("data", (chunk) => {
      chunks.push(chunk); // Append each chunk to the `data` variable
    });

    readStream.on("end", () => {
      const data = Buffer.concat(chunks);
      resolve(data); // Resolve the promise with the full file content
    });

    readStream.on("error", (err) => {
      reject(err); // Reject the promise if an error occurs
    });
  });
}

const minMaxScale = (value: number, min: number, max: number) => {
  return (value - min) / (max - min);
};

const readFile = async (filePath: string) => {
  const buffer = await fs.readFile(filePath);
  // return new Uint8ClampedArray(buffer.buffer);
  return buffer;
};

export const initConfig = async () => {
  const baseEzklPath = path.join(__dirname, "../../../../../../ezkl");
  const settingsPath = path.join(baseEzklPath, "settings.json");
  const modelPath = path.join(baseEzklPath, "network.compiled");
  const kzgPath = path.join(baseEzklPath, "kzg14.srs");
  const pkPath = path.join(baseEzklPath, "pk.key");
  const inputPath = path.join(baseEzklPath, "input.json");

  // if (!fs.existsSync(settingsPath)) throw new Error("Settings file not found");
  // if (!fs.existsSync(modelPath)) throw new Error("Model file not found");
  // if (!fs.existsSync(kzgPath)) throw new Error("KZG file not found");
  // if (!fs.existsSync(pkPath)) throw new Error("PK file not found");

  console.log("Loading config");
  const settings = await readFile(settingsPath);
  const model = await readFile(modelPath);
  const kzg = await readFile(kzgPath);
  const pk = await readFile(pkPath);
  const input = await readFile(inputPath);

  console.log("Config loaded");

  return { settings, model, kzg, pk, input };
};

export const normalizeFormData = (formData: any) => {
  const normalizedData = {
    gender: convertStringToNumber(formData.gender),
    married: convertStringToNumber(formData.married),
    dependents: convertStringToNumber(formData.dependents),
    education: convertStringToNumber(formData.education),
    selfEmployed: convertStringToNumber(formData.selfEmployed),
    applicantIncome: Math.sqrt(formData.applicantIncome),
    coapplicantIncome: Math.sqrt(formData.coapplicantIncome) || 0, // 0 if not provided
    loanAmount: Math.sqrt(formData.loanAmount),
    loanTerm: formData.loanTerm,
    creditHistory: Number(formData.creditHistory),
    propertyArea: convertStringToNumber(formData.propertyArea),
  };

  const dependentsEncoding = [
    normalizedData.dependents === 0 ? 1 : 0, // Dependents_0
    normalizedData.dependents === 1 ? 1 : 0, // Dependents_1
    normalizedData.dependents === 2 ? 1 : 0, // Dependents_2
    normalizedData.dependents === 3 ? 1 : 0, // Dependents_3+
  ];

  const scaledData = [
    normalizedData.applicantIncome,
    normalizedData.coapplicantIncome,
    normalizedData.loanAmount,
    normalizedData.loanTerm,
    normalizedData.creditHistory,
    normalizedData.gender,
    normalizedData.married,
    ...dependentsEncoding,
    normalizedData.education,
    normalizedData.selfEmployed,
    normalizedData.propertyArea === 0 ? 1 : 0, // Rural
    normalizedData.propertyArea === 1 ? 1 : 0, // Semiurban
    normalizedData.propertyArea === 2 ? 1 : 0, // Urban
  ].map((value, index) =>
    minMaxScale(value, min_scale_values[index], max_scale_values[index])
  );

  return scaledData;
};
