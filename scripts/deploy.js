const hre = require("hardhat");

async function main() {
  const Verifier = await hre.ethers.getContractFactory("CreditScoreVerifier");
  const verifier = await Verifier.deploy();
  await verifier.deployed();
  console.log(`Verifier deployed at: ${verifier.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});