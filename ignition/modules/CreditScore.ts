import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import proofJson from "../../ezkl/proof.json";

export default buildModule("CreditScore", (m) => {
  const verifier = m.contract("CreditScoreVerifier", []);

  // Make sure the deployment works as expected
  m.call(verifier, "verifyCreditScore", [proofJson.hex_proof, [0, 0, 0]]);

  return { verifier };
});
