import { ethers } from "hardhat";

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const { chainId, name } = await ethers.provider.getNetwork()!;
  console.log(`deploying to ${name} (${chainId})`);
  const SimpleToken = await ethers.getContractFactory("SimpleToken");
  const estimatedGasERC20 = await ethers.provider.estimateGas(
    SimpleToken.getDeployTransaction(
      "ERC20",
      "ERC20",
      ethers.utils.parseEther("100000000")
    ).data as any
  );
  console.log("ERC20 deployment gas cost", estimatedGasERC20.toString());

  const SimpleNft = await ethers.getContractFactory("SimpleNft");
  const estimatedGasNft = await ethers.provider.estimateGas(
    SimpleNft.getDeployTransaction("ERC721", "ERC721").data as any
  );
  console.log("ERC721 deployment gas cost", estimatedGasNft.toString());

  const Race2Uranus = await ethers.getContractFactory("Race2Uranus");
  const estimatedGasR2u = await ethers.provider.estimateGas(
    Race2Uranus.getDeployTransaction().data as any
  );
  console.log("R2U deployment gas cost", estimatedGasR2u.toString());
}
