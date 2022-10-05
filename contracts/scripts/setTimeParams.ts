import { ethers } from "hardhat";

import { Race2Uranus } from "../typechain-types";

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const { chainId, name } = await ethers.provider.getNetwork()!;
  console.log(`setTimeParams on ${name} (${chainId})`);
  const Race2UranusFactory = await ethers.getContractFactory("Race2Uranus");

  // change values as needed
  const race2Uranus = Race2UranusFactory.attach(
    "0x0000000000000000000000000000000000000000"
  );
  await setTimeParams({
    contract: race2Uranus,
    blockTimeMillis: 15000,
    revealDelayMinutes: 5,
    // every 10 minutes
    blastOffTimes: (() => {
      const minuteSeconds = 60;
      const hourSeconds = 60 * minuteSeconds;
      const startTime = 0 * hourSeconds;
      const endTime = 23.95 * hourSeconds;
      const step = 10 * minuteSeconds;

      const times = [];
      for (let t = startTime; t <= endTime; t += step) {
        times.push(t);
      }

      return times;
    })(),
  });

  console.log("✅ updated");

  const [res] = await race2Uranus.functions.getTimeParams();

  console.log("new values:");
  console.log("blastOffTimes", res.blastOffTimes);
  console.log("revealDelayMinutes", res.revealDelayMinutes);
  console.log("blockTimeMillis", res.blockTimeMillis);
}

async function setTimeParams({
  contract,
  blastOffTimes,
  revealDelayMinutes,
  blockTimeMillis,
}: {
  contract: Race2Uranus;
  blastOffTimes?: number[];
  revealDelayMinutes?: number;
  blockTimeMillis?: number;
}) {
  const [res] = await contract.functions.getTimeParams();

  await contract.functions.setTimeParams({
    blastOffTimes: blastOffTimes || res.blastOffTimes,
    blockTimeMillis: blockTimeMillis || res.blockTimeMillis,
    revealDelayMinutes: revealDelayMinutes || res.revealDelayMinutes,
  });
}
