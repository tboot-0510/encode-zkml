import hre from "hardhat";
import { expect } from "chai";
import { ethers } from "ethers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import proofJson from "../ezkl/proof.json";
import { CreditScoreVerifier } from "../typechain-types";

describe("CreditScoreVerifier", function () {
  let verifier: CreditScoreVerifier;

  beforeEach(async () => {
    verifier = await hre.ethers.deployContract(
      "CreditScoreVerifier"
    );
  });

  it("should emit ProofVerified for invalid proof with correct args", async () => {
    const fakeProof = ethers.hexlify(ethers.randomBytes(128));
    const fakePublicInputs = [1, 2, 3]; // dummy inputs, won't validate

    await expect(verifier.verifyCreditScore(fakeProof, fakePublicInputs))
      .to.emit(verifier, "ProofVerified")
      .withArgs(anyValue, anyValue, false, "Proof threw error");
  });

  it("should return false for invalid proof", async () => {
    const fakeProof = ethers.hexlify(ethers.randomBytes(128));
    const fakePublicInputs = [1, 2, 3]; // dummy inputs, won't validate

    const result = await verifier.verifyCreditScore.staticCall(fakeProof, fakePublicInputs);

    expect(result).to.be.false;
  });

  it("should emit ProofVerified event for valid proof with correct args", async () => {
    const proofHex = proofJson.hex_proof;

    // DEBUG: The generate proof.json file contains empty array []  for proofJson.pretty_public_inputs.inputs
    // But when use `ezkl encode-evm-calldata` that binary file contains following public input in there
    const publicInput = [0, 0, 0];

    const inputHash = ethers.keccak256(
      ethers.solidityPacked(["uint256[]"], [publicInput])
    );

    await expect(verifier.verifyCreditScore(proofHex, publicInput))
      .to.emit(verifier, "ProofVerified")
      .withArgs(anyValue, inputHash, true, "");
  });

  it("should return true for valid proof", async () => {
    const proofHex = proofJson.hex_proof;

    // proofJson.pretty_public_inputs.inputs
    const publicInput = [0, 0, 0];

    const result = await verifier.verifyCreditScore.staticCall(proofHex, publicInput);

    expect(result).to.be.true;
  });

  it("should have ProofVerified event log", async () => {
    const fakeProof = ethers.hexlify(ethers.randomBytes(128));
    const fakePublicInputs = [1, 2, 3]; // dummy inputs

    const tx = await verifier.verifyCreditScore(fakeProof, fakePublicInputs);
    const receipt = await tx.wait();

    const proofVerifiedEvent = receipt?.logs.find(
      (log: any) => log.fragment?.name === "ProofVerified" && log.fragment?.type === "event"
    )?.args;

    expect(proofVerifiedEvent).to.not.be.undefined;
    expect(proofVerifiedEvent[0]).to.be.a("string");
    expect(proofVerifiedEvent[1]).to.be.a("string");
    expect(proofVerifiedEvent[2]).to.be.a("boolean");
    expect(proofVerifiedEvent[3]).to.be.a("string");
  });
});
