import { BigNumber } from "ethers";
import { ethers, upgrades, run } from "hardhat";

import { Race2Uranus } from "../typechain-types";

const MAGIC_ADDRESS = "0x539bdE0d7Dbd336b79148AA742883198BBF60342";
const LEGIONS_ADDRESS = "0xfE8c1ac365bA6780AEc5a985D989b327C27670A1";
const SMOLBRAINS_ADDRESS = "0x4bB8209cC9122Ea8536C7Ae3cF67F3EcF8f4D103";
const SMOLBODIES_ADDRESS = "0x17DaCAD7975960833f374622fad08b90Ed67D1B5";
const BATTLEFLY_ADDRESS = "0x0aF85A5624D24E2C6e7Af3c0a0b102a28E36CeA3";
const TOADSTOOLZ_ADDRESS = "0x09CAE384C6626102ABE47Ff50588A1dBe8432174";
const LOST_DONKEYS_ADDRESS = "0x5e84c1A06E6AD1a8ED66Bc48dBe5eB06BF2Fe4aA";
const IMBUED_SOULS_ADDRESS = "0xDc758b92c7311280aeeB48096a3bf4D1C1f936d4";
const WHITELISTED_NFTS = [
  LEGIONS_ADDRESS,
  SMOLBRAINS_ADDRESS,
  SMOLBODIES_ADDRESS,
  BATTLEFLY_ADDRESS,
  TOADSTOOLZ_ADDRESS,
  LOST_DONKEYS_ADDRESS,
  IMBUED_SOULS_ADDRESS,
];
const ARBITRUM_CHAIN_ID = 42161;
const VERIFY = true;

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`using ${deployer.address}`);
  const { chainId, name } = await deployer.provider?.getNetwork()!;
  console.log(`deploying to ${name} (${chainId})`);

  const { magic, whitelistedNfts } = await getDependentContractAddresses(
    chainId
  );

  await ethBalanceStart();

  const Race2Uranus = await ethers.getContractFactory("Race2Uranus");
  const race2Uranus: Race2Uranus = (await upgrades.deployProxy(
    Race2Uranus,
    [magic, whitelistedNfts, deployer.address],
    {
      kind: "uups", // https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable
    }
  )) as any;

  await ethBalanceEnd("", "Race2Uranus deployment cost");

  if (VERIFY) {
    try {
      await run("verify:verify", {
        address: race2Uranus.address,
        // constructorArguments: [magic, whitelistedNfts, deployer.address],
      });
    } catch (e) {
      console.error(e);
    }
  }

  console.log("Race2Uranus deployed to:", race2Uranus.address);
  console.log("MAGIC address:", magic);
  console.log("whitelisted NFTs:", whitelistedNfts);
}

async function getDependentContractAddresses(
  chainId: number
): Promise<{ magic: string; whitelistedNfts: string[] }> {
  if (chainId === ARBITRUM_CHAIN_ID) {
    return { magic: MAGIC_ADDRESS, whitelistedNfts: WHITELISTED_NFTS };
  }

  await ethBalanceStart();

  console.log("deploying dependencies...");

  console.log("deploying MAGIC...");
  const magic = await deployMagic();
  console.log("deployed MAGIC to", magic.address);
  console.log("deploying SMOL...");
  const smolBrains = await deploySmolBrains();
  console.log("deployed SMOL to", smolBrains.address);
  console.log("deploying BTLFLY...");
  const battlefly = await deployBattlefly();
  console.log("deployed BTLFLY to", battlefly.address);

  await ethBalanceEnd("", "Total cost of deploying dependencies");

  return {
    magic: magic.address,
    whitelistedNfts: [smolBrains.address, battlefly.address],
  };
}

async function deployMagic() {
  const SimpleToken = await ethers.getContractFactory("SimpleToken");
  const magic = await SimpleToken.deploy(
    "MAGIC",
    "MAGIC",
    ethers.utils.parseEther("100000000")
  );

  if (VERIFY) {
    try {
      await run("verify:verify", {
        address: magic.address,
        constructorArguments: [
          "MAGIC",
          "MAGIC",
          ethers.utils.parseEther("100000000"),
        ],
        contract: "contracts/SimpleToken.sol:SimpleToken",
      });
    } catch (e) {
      console.error(e);
    }
  }

  return magic;
}
async function deploySmolBrains() {
  const SimpleNft = await ethers.getContractFactory("SimpleNft");
  const smolBrains = await SimpleNft.deploy("SmolBrains", "SMOL");

  if (VERIFY) {
    try {
      await run("verify:verify", {
        address: smolBrains.address,
        constructorArguments: ["SmolBrains", "SMOL"],
      });
    } catch (e) {
      console.error(e);
    }
  }

  return smolBrains;
}
async function deployBattlefly() {
  const SimpleNft = await ethers.getContractFactory("SimpleNft");
  const battlefly = await SimpleNft.deploy("Battlefly", "BTLFLY");

  if (VERIFY) {
    try {
      await run("verify:verify", {
        address: battlefly.address,
        constructorArguments: ["Battlefly", "BTLFLY"],
      });
    } catch (e) {
      console.error(e);
    }
  }

  return battlefly;
}

const _balances: { [key: string]: BigNumber } = {};
async function ethBalanceStart(addr?: string) {
  const [signer] = await ethers.getSigners();
  const deployer = await signer.getAddress();
  const address = addr || deployer;
  const res = await ethers.provider.getBalance(address);
  _balances[address] = res;
}
async function ethBalanceEnd(addr?: string, msg?: string) {
  const [signer] = await ethers.getSigners();
  const deployer = await signer.getAddress();
  const address = addr || deployer;
  const newBalance = await ethers.provider.getBalance(address);
  const oldBalance = _balances[address];
  const diff = newBalance.gt(oldBalance)
    ? newBalance.sub(oldBalance)
    : oldBalance.sub(newBalance);
  const gasPrice = await ethers.provider.getGasPrice();
  const gasUsed = diff.div(gasPrice);
  console.log(
    msg,
    "ETH consumed",
    ethers.utils.formatEther(diff),
    "gas used ~",
    gasUsed.toString(),
    "gas price",
    ethers.utils.formatUnits(gasPrice.toString(), "gwei")
  );
}
