import { ethers } from "hardhat";

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const { chainId, name } = await ethers.provider.getNetwork()!;
  console.log(`createFirstRace on ${name} (${chainId})`);
  const Race2UranusFactory = await ethers.getContractFactory("Race2Uranus");

  // change values as needed
  const race2Uranus = Race2UranusFactory.attach(
    "0x0000000000000000000000000000000000000000"
  );
  const [numRaces] = await race2Uranus.functions.getActiveRaceIds();

  if (numRaces.length > 0) {
    console.log("race already created");
    return;
  }

  console.log("creating race...");

  await race2Uranus.createRace();

  console.log("✅ created");
}
