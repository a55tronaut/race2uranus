import { ethers } from "hardhat";

import { SimpleNft } from "../typechain-types";

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const { chainId, name } = await ethers.provider.getNetwork()!;
  console.log(`sendTestTokens on ${name} (${chainId})`);
  const SimpleToken = await ethers.getContractFactory("SimpleToken");
  const SimpleNft = await ethers.getContractFactory("SimpleNft");
  // change values as needed
  const magic = SimpleToken.attach(
    "0x0000000000000000000000000000000000000000"
  );
  const battlefly = SimpleNft.attach(
    "0x0000000000000000000000000000000000000000"
  );
  const smolBrains = SimpleNft.attach(
    "0x0000000000000000000000000000000000000000"
  );

  const recipient = "0x0000000000000000000000000000000000000000";

  console.log("sending MAGIC...");
  await magic.transfer(recipient, ethers.utils.parseEther("10000"));
  console.log("✅ sent MAGIC");

  await mintNftsTo({
    recipient,
    contract: battlefly,
    count: 5,
  });

  await mintNftsTo({
    recipient,
    contract: smolBrains,
    count: 5,
  });

  console.log("✅ sent NFTs");
}

async function mintNftsTo({
  recipient,
  contract,
  count,
}: {
  recipient: string;
  contract: SimpleNft;
  count: number;
}) {
  const name = await contract.name();
  for (let i = 0; i < count; i++) {
    console.log(`minting ${name} #${i} to ${recipient}...`);
    await contract.mint(recipient);
    console.log(`✅ minted ${name} #${i}`);
  }
}
