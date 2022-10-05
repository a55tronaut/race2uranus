import { BigNumberish } from "ethers";
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
  console.log(`setRaceConfig on ${name} (${chainId})`);
  const Race2UranusFactory = await ethers.getContractFactory("Race2Uranus");

  // change values as needed
  const race2Uranus = Race2UranusFactory.attach(
    "0x0000000000000000000000000000000000000000"
  );
  await setRaceConfig({
    contract: race2Uranus,
    maxRockets: 5,
  });

  console.log("✅ updated");

  const [res] = await race2Uranus.functions.getRaceConfig();

  console.log("new values:");
  console.log("maxRockets", res.maxRockets);
  console.log("minStakeAmount", ethers.utils.formatEther(res.minStakeAmount));
  console.log("maxStakeAmount", ethers.utils.formatEther(res.maxStakeAmount));
  console.log("revealBounty", ethers.utils.formatEther(res.revealBounty));
  console.log("boostPrice", ethers.utils.formatEther(res.boostPrice));
  console.log("boostAmount", res.boostAmount);
  console.log("rocketsSharePercent", res.rocketsSharePercent);
  console.log("winningRocketSharePercent", res.winningRocketSharePercent);
  console.log("devFeePercent", res.devFeePercent);
  console.log("whitelistedNfts", res.whitelistedNfts);
}

async function setRaceConfig({
  contract,
  maxRockets,
  minStakeAmount,
  maxStakeAmount,
  revealBounty,
  boostPrice,
  boostAmount,
  rocketsSharePercent,
  winningRocketSharePercent,
  devFeePercent,
  whitelistedNfts,
}: {
  contract: Race2Uranus;
  maxRockets?: number;
  minStakeAmount?: BigNumberish;
  maxStakeAmount?: BigNumberish;
  revealBounty?: BigNumberish;
  boostPrice?: BigNumberish;
  boostAmount?: number;
  rocketsSharePercent?: number;
  winningRocketSharePercent?: number;
  devFeePercent?: number;
  whitelistedNfts?: string[];
}) {
  const [res] = await contract.functions.getRaceConfig();

  await contract.functions.setRaceConfig({
    maxRockets: maxRockets || res.maxRockets,
    minStakeAmount: minStakeAmount || res.minStakeAmount,
    maxStakeAmount: maxStakeAmount || res.maxStakeAmount,
    revealBounty: revealBounty || res.revealBounty,
    boostPrice: boostPrice || res.boostPrice,
    boostAmount: boostAmount || res.boostAmount,
    rocketsSharePercent: rocketsSharePercent || res.rocketsSharePercent,
    winningRocketSharePercent:
      winningRocketSharePercent || res.winningRocketSharePercent,
    devFeePercent: devFeePercent || res.devFeePercent,
    whitelistedNfts: whitelistedNfts || res.whitelistedNfts,
  });
}
