import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, BigNumberish } from "ethers";
import { ethers, upgrades } from "hardhat";
import moment from "moment-timezone";

import { Race2Uranus, SimpleNft, SimpleToken } from "../typechain-types";

const race2UranusName = "Race2Uranus";

const ARRAY_OUT_OF_BOUNDS_PANIC_CODE = "0x32";

const beneficiary = ethers.Wallet.createRandom();

interface IActors {
  admin: IAdmin;
  rocketeerAlice: IRocketeer;
  rocketeerBob: IRocketeer;
  rocketeerCarol: IRocketeer;
  stakerDan: IStaker;
  stakerErin: IStaker;
  stakerFrank: IStaker;
}

interface IActor {
  signer: SignerWithAddress;
  address: string;
  race2Uranus: Race2Uranus;
}

interface IAdmin extends IActor {}

interface IRocketeer extends IActor {
  nft: SimpleNft;
  nftIds: string[];
}

interface IStaker extends IActor {}

describe(race2UranusName, () => {
  async function deployBasicFixture() {
    const magic = await deployMagic();
    const smolBrains = await deploySmolBrains();
    const battlefly = await deployBattlefly();
    const whitelistedNfts = [smolBrains.address, battlefly.address];
    const race2Uranus = await deployRace2Uranus(
      magic.address,
      beneficiary.address,
      whitelistedNfts
    );

    return {
      race2Uranus,
      magic,
      smolBrains,
      battlefly,
      whitelistedNfts,
    };
  }

  async function deployMagic() {
    const SimpleToken = await ethers.getContractFactory("SimpleToken");
    const magic = await SimpleToken.deploy(
      "MAGIC",
      "MAGIC",
      ethers.utils.parseEther("100000000")
    );

    return magic;
  }
  async function deploySmolBrains() {
    const SimpleNft = await ethers.getContractFactory("SimpleNft");
    const smolBrains = await SimpleNft.deploy("SmolBrains", "SMOL");

    return smolBrains;
  }
  async function deployBattlefly() {
    const SimpleNft = await ethers.getContractFactory("SimpleNft");
    const battlefly = await SimpleNft.deploy("Battlefly", "BTLFLY");

    return battlefly;
  }
  async function deployRace2Uranus(
    magicAddress: string,
    beneficiaryAddress: string,
    whitelistedNfts: string[]
  ) {
    const Race2Uranus = await ethers.getContractFactory(race2UranusName);
    const race2Uranus: Race2Uranus = (await upgrades.deployProxy(
      Race2Uranus,
      [magicAddress, whitelistedNfts, beneficiaryAddress],
      {
        kind: "uups", // https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable
      }
    )) as any;

    return race2Uranus;
  }

  async function deployFixtureWithActors() {
    const contracts = await loadFixture(deployBasicFixture);
    const actors = await prepareActors({
      race2Uranus: contracts.race2Uranus,
      magic: contracts.magic,
      battlefly: contracts.battlefly,
      smolBrains: contracts.smolBrains,
    });

    return { ...contracts, ...actors };
  }

  async function deployFixtureWithRace() {
    const res = await deployFixtureWithActors();
    await setTimeParams({
      admin: res.admin,
      blastOffTimes: Array.from(Array(24).keys()).map((h) => h * 60 * 60),
      blockTimeMillis: 100,
      revealDelayMinutes: 30,
    });
    await setRaceConfig({
      admin: res.admin,
      maxRockets: 3,
      revealBounty: ethers.utils.parseEther("3"),
    });
    const { race } = await createRace({ admin: res.admin });

    return { ...res, race };
  }

  async function deployFixtureWithEnteredRace() {
    const res = await deployFixtureWithRace();
    const entrant = await enterRace({
      raceId: res.race.id,
      rocketeer: res.rocketeerAlice,
    });

    return { ...res, entrant };
  }

  async function deployFixtureWithFilledRace() {
    const res = await deployFixtureWithActors();
    await setRaceConfig({
      admin: res.admin,
      maxRockets: 3,
      revealBounty: ethers.utils.parseEther("3"),
    });
    await setTimeParams({
      admin: res.admin,
      blastOffTimes: Array.from(Array(24).keys()).map((h) => h * 60 * 60),
      blockTimeMillis: 100 * 100,
      revealDelayMinutes: 3,
    });
    const { race } = await createRace({ admin: res.admin });
    const entrants = await fillRace({
      raceId: race.id,
      rocketeers: [
        { rocketeer: res.rocketeerAlice },
        { rocketeer: res.rocketeerBob },
        { rocketeer: res.rocketeerCarol },
      ],
    });

    const [updatedRace] = await res.admin.race2Uranus.functions.getRace(
      race.id
    );

    return { ...res, race: updatedRace, entrants };
  }

  async function deployFixtureWithFinishedRace() {
    const res = await deployFixtureWithFilledRace();

    await stakeOnRocket({
      staker: res.stakerDan,
      raceId: res.race.id,
      rocketId: "0",
      amount: res.race.configSnapshot.minStakeAmount.mul("2"),
    });
    await stakeOnRocket({
      staker: res.stakerErin,
      raceId: res.race.id,
      rocketId: "1",
      amount: res.race.configSnapshot.minStakeAmount.mul("3"),
    });
    await stakeOnRocket({
      staker: res.stakerFrank,
      raceId: res.race.id,
      rocketId: "2",
      amount: res.race.configSnapshot.minStakeAmount.mul("4"),
    });

    await mineBlocks(res.race.revealBlock.toNumber());

    await res.race2Uranus.functions.finishRace(res.race.id);

    const [updatedRace] = await res.admin.race2Uranus.functions.getRace(
      res.race.id
    );

    return { ...res, race: updatedRace };
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

  //////////////////////////////////////////////////

  async function prepareActors({
    race2Uranus,
    magic,
    smolBrains,
    battlefly,
  }: {
    race2Uranus: Race2Uranus;
    magic: SimpleToken;
    smolBrains: SimpleNft;
    battlefly: SimpleNft;
  }): Promise<IActors> {
    const signers = await ethers.getSigners();

    const admin: IAdmin = {
      signer: signers[0],
      address: await signers[0].getAddress(),
      race2Uranus,
    };

    const aliceSigner = signers[1];
    const aliceAddress = await aliceSigner.getAddress();
    const nftIdsAlice = await (async () => {
      const ids = [];
      for (let i = 0; i < 2; i++) {
        const id = await smolBrains.totalSupply();
        await smolBrains.mint(aliceAddress);
        ids.push(id.toString());
      }
      return ids;
    })();
    const rocketeerAlice: IRocketeer = {
      signer: aliceSigner,
      address: aliceAddress,
      nft: smolBrains,
      nftIds: nftIdsAlice,
      race2Uranus: race2Uranus.connect(aliceSigner),
    };
    await magic.transfer(aliceAddress, ethers.utils.parseEther("1000"));

    const bobSigner = signers[2];
    const bobAddress = await bobSigner.getAddress();
    const nftIdsBob = await (async () => {
      const ids = [];
      for (let i = 0; i < 2; i++) {
        const id = await smolBrains.totalSupply();
        await smolBrains.mint(bobAddress);
        ids.push(id.toString());
      }
      return ids;
    })();
    const rocketeerBob: IRocketeer = {
      signer: bobSigner,
      address: bobAddress,
      nft: smolBrains,
      nftIds: nftIdsBob,
      race2Uranus: race2Uranus.connect(bobSigner),
    };
    await magic.transfer(bobAddress, ethers.utils.parseEther("1000"));

    const carolSigner = signers[3];
    const carolAddress = await carolSigner.getAddress();
    const nftIdsCarol = await (async () => {
      const ids = [];
      for (let i = 0; i < 2; i++) {
        const id = await battlefly.totalSupply();
        await battlefly.mint(carolAddress);
        ids.push(id.toString());
      }
      return ids;
    })();
    const rocketeerCarol: IRocketeer = {
      signer: carolSigner,
      address: carolAddress,
      nft: battlefly,
      nftIds: nftIdsCarol,
      race2Uranus: race2Uranus.connect(carolSigner),
    };
    await magic.transfer(carolAddress, ethers.utils.parseEther("1000"));

    const danSigner = signers[4];
    const danAddress = await danSigner.getAddress();
    const stakerDan: IStaker = {
      signer: danSigner,
      address: danAddress,
      race2Uranus: race2Uranus.connect(danSigner),
    };
    await magic.transfer(danAddress, ethers.utils.parseEther("1000000"));

    const erinSigner = signers[5];
    const erinAddress = await erinSigner.getAddress();
    const stakerErin: IStaker = {
      signer: erinSigner,
      address: erinAddress,
      race2Uranus: race2Uranus.connect(erinSigner),
    };
    await magic.transfer(erinAddress, ethers.utils.parseEther("1000000"));

    const frankSigner = signers[6];
    const frankAddress = await frankSigner.getAddress();
    const stakerFrank: IStaker = {
      signer: frankSigner,
      address: frankAddress,
      race2Uranus: race2Uranus.connect(frankSigner),
    };
    await magic.transfer(frankAddress, ethers.utils.parseEther("1000000"));

    for (let i = 0; i < 7; i++) {
      await magic
        .connect(signers[i])
        .approve(race2Uranus.address, ethers.utils.parseEther("100000000"));
    }

    const actors: IActors = {
      admin,
      rocketeerAlice,
      rocketeerBob,
      rocketeerCarol,
      stakerDan,
      stakerErin,
      stakerFrank,
    };

    return actors;
  }

  async function setRaceConfig({
    admin,
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
    admin: IAdmin;
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
    const res = await admin.race2Uranus.getRaceConfig();

    await admin.race2Uranus.setRaceConfig({
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

  async function setTimeParams({
    admin,
    blastOffTimes,
    revealDelayMinutes,
    blockTimeMillis,
  }: {
    admin: IAdmin;
    blastOffTimes?: number[];
    revealDelayMinutes?: number;
    blockTimeMillis?: number;
  }) {
    const [res] = await admin.race2Uranus.functions.getTimeParams();

    await admin.race2Uranus.functions.setTimeParams({
      blastOffTimes: blastOffTimes || res.blastOffTimes,
      blockTimeMillis: blockTimeMillis || res.blockTimeMillis,
      revealDelayMinutes: revealDelayMinutes || res.revealDelayMinutes,
    });
  }

  async function createRace({ admin }: { admin: IAdmin }): Promise<{
    race: Race2Uranus.RaceStructOutput;
  }> {
    await admin.race2Uranus.functions.createRace();

    const raceCount = await admin.race2Uranus.getRaceCount();

    const [race] = await admin.race2Uranus.functions.getRace(
      raceCount.sub("1")
    );

    return {
      race,
    };
  }

  async function enterRace({
    raceId,
    rocketeer,
    nftAddress,
    nftIdIndex = 0,
    amount,
  }: {
    raceId: BigNumberish;
    rocketeer: IRocketeer;
    nftAddress?: string;
    nftIdIndex?: number;
    amount?: BigNumberish;
  }): Promise<{
    rocket: Race2Uranus.RocketStructOutput;
    nftId: BigNumber;
    amount: BigNumber;
  }> {
    let _nftId = ethers.BigNumber.from("0");
    try {
      _nftId = ethers.BigNumber.from(rocketeer.nftIds[nftIdIndex]);
    } catch (e) {
      //
    }

    const _nftAddress = nftAddress || rocketeer.nft.address;

    const [race] = await rocketeer.race2Uranus.functions.getRace(raceId);

    const _amount = amount
      ? ethers.BigNumber.from(amount)
      : race.configSnapshot.minStakeAmount;

    await rocketeer.race2Uranus.functions.enterRace(
      raceId,
      _nftAddress,
      _nftId,
      _amount
    );

    const [rockets] = await rocketeer.race2Uranus.functions.getRocketsForRace(
      raceId
    );

    return {
      nftId: _nftId,
      amount: _amount,
      rocket: rockets[rockets.length - 1],
    };
  }

  async function stakeOnRocket({
    staker,
    raceId,
    rocketId,
    amount,
  }: {
    staker: IActor;
    raceId: BigNumberish;
    rocketId: BigNumberish;
    amount?: BigNumberish;
  }): Promise<{ amount: BigNumberish }> {
    const [race] = await staker.race2Uranus.functions.getRace(raceId);

    const _amount = amount
      ? ethers.BigNumber.from(amount)
      : race.configSnapshot.minStakeAmount;

    await staker.race2Uranus.functions.stakeOnRocket(raceId, rocketId, _amount);

    return { amount: _amount };
  }

  async function fillRace({
    raceId,
    rocketeers,
  }: {
    raceId: BigNumberish;
    rocketeers: {
      rocketeer: IRocketeer;
      nftAddress?: string;
      nftIdIndex?: number;
      amount?: BigNumberish;
    }[];
  }) {
    const results = [];

    for (const rocketeer of rocketeers) {
      const res = await enterRace({
        raceId,
        ...rocketeer,
      });

      results.push(res);
    }

    return results;
  }

  async function mineBlocks(n: number) {
    for (let index = 0; index < n; index++) {
      await ethers.provider.send("evm_mine", []);
    }
  }

  async function mineBlocksUntil(blockNum: number) {
    const currentBlockNum = await ethers.provider.getBlockNumber();
    const diff = blockNum - currentBlockNum;

    if (diff > 0) {
      await mineBlocks(diff);
    }
  }

  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////

  describe("deployment", () => {
    it("deploys", async () => {
      await loadFixture(deployBasicFixture);
    });

    it("shows deployment cost of ERC20", async () => {
      await ethBalanceStart();
      await deployMagic();
      await ethBalanceEnd("", "ERC20");
    });

    it("shows deployment cost of ERC721", async () => {
      await ethBalanceStart();
      await deploySmolBrains();
      await ethBalanceEnd("", "ERC721");
    });

    it("shows deployment cost of Race2Uranus", async () => {
      await ethBalanceStart();
      const randomAddr = ethers.Wallet.createRandom().address;
      await deployRace2Uranus(randomAddr, randomAddr, [randomAddr, randomAddr]);
      await ethBalanceEnd("", "Race2Uranus");
    });
  });

  describe("initialize()", () => {
    it("sets up owner of the contract", async () => {
      const { race2Uranus, magic, smolBrains, battlefly } = await loadFixture(
        deployBasicFixture
      );
      const { admin } = await prepareActors({
        race2Uranus,
        magic,
        smolBrains,
        battlefly,
      });

      const contractOwner = await race2Uranus.owner();

      expect(contractOwner).to.equal(admin.address);
    });

    it("sets up initial values", async () => {
      const { race2Uranus, magic, whitelistedNfts } = await loadFixture(
        deployBasicFixture
      );

      const magicAddress = await race2Uranus.magic();
      const autoCreateNextRace = await race2Uranus.autoCreateNextRace();

      expect(magicAddress).to.equal(magic.address);
      expect(autoCreateNextRace).to.equal(true);

      const [raceConfig] = await race2Uranus.functions.getRaceConfig();

      expect(raceConfig.maxRockets).not.to.equal(0);
      expect(raceConfig.minStakeAmount.toString()).not.to.equal("0");
      expect(raceConfig.maxStakeAmount.toString()).not.to.equal("0");
      expect(raceConfig.revealBounty.toString()).not.to.equal("0");
      expect(raceConfig.rocketsSharePercent).not.to.equal(0);
      expect(raceConfig.winningRocketSharePercent).not.to.equal(0);
      expect(raceConfig.devFeePercent).not.to.equal(0);

      const whitelistedNftsContract = await race2Uranus.getWhitelistedNfts();

      expect(whitelistedNftsContract).to.deep.equal(whitelistedNfts);
    });
  });

  describe("setAutoCreateNextRace()", () => {
    it("sets autoCreateNextRace", async () => {
      const { race2Uranus } = await loadFixture(deployBasicFixture);
      const [oldValue] = await race2Uranus.functions.autoCreateNextRace();

      await race2Uranus.functions.setAutoCreateNextRace(!oldValue);
      const [newValue] = await race2Uranus.functions.autoCreateNextRace();

      expect(newValue).to.equal(!oldValue);
    });

    it("does NOT allow non-admins to change the value", async () => {
      const { stakerDan } = await deployFixtureWithActors();

      await expect(
        stakerDan.race2Uranus.functions.setAutoCreateNextRace(true)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("setRaceConfig()", () => {
    it("sets config", async () => {
      const { race2Uranus } = await loadFixture(deployBasicFixture);

      const maxRockets = 7;
      const minStakeAmount = BigNumber.from("11");
      const maxStakeAmount = BigNumber.from("2222");
      const revealBounty = BigNumber.from("34");
      const boostPrice = ethers.utils.parseEther("3");
      const boostAmount = 3;
      const rocketsSharePercent = 22;
      const winningRocketSharePercent = 75;
      const devFeePercent = 11;
      const whitelistedNfts = ["0x77Ae93f4BF9010bEB40F4a1Ed2fAEB3a215384b9"];

      await race2Uranus.functions.setRaceConfig({
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
      });

      const raceConfig = await race2Uranus.getRaceConfig();

      expect(raceConfig.maxRockets).to.equal(maxRockets);
      expect(raceConfig.minStakeAmount.toString()).to.equal(minStakeAmount);
      expect(raceConfig.maxStakeAmount.toString()).to.equal(maxStakeAmount);
      expect(raceConfig.revealBounty.toString()).to.equal(revealBounty);
      expect(raceConfig.boostPrice).to.equal(boostPrice);
      expect(raceConfig.boostAmount).to.equal(boostAmount);
      expect(raceConfig.rocketsSharePercent).to.equal(rocketsSharePercent);
      expect(raceConfig.winningRocketSharePercent).to.equal(
        winningRocketSharePercent
      );
      expect(raceConfig.devFeePercent).to.equal(devFeePercent);

      expect(raceConfig.whitelistedNfts).to.deep.equal(whitelistedNfts);
    });

    it("does NOT allow non-admin to set config", async () => {
      const { race2Uranus, rocketeerAlice } = await deployFixtureWithActors();

      const [currentConfig] = await race2Uranus.functions.getRaceConfig();

      const newConfig: any = {};

      Object.keys(currentConfig)
        .filter((k) => isNaN(Number(k)))
        .forEach((k: any) => {
          newConfig[k] = currentConfig[k];
        });

      newConfig.maxRockets = 3;

      await expect(
        rocketeerAlice.race2Uranus.functions.setRaceConfig(newConfig)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("does NOT allow reveal bounty higher than minimum possible reward pool size", async () => {
      const { race2Uranus } = await loadFixture(deployBasicFixture);

      const [currentConfig] = await race2Uranus.functions.getRaceConfig();

      const newConfig: any = {};

      Object.keys(currentConfig)
        .filter((k) => isNaN(Number(k)))
        .forEach((k: any) => {
          newConfig[k] = currentConfig[k];
        });

      newConfig.maxRockets = 3;
      newConfig.minStakeAmount = BigNumber.from("1");
      newConfig.revealBounty = BigNumber.from("5");
      newConfig.whitelistedNfts = [];

      await expect(
        race2Uranus.functions.setRaceConfig(newConfig)
      ).to.be.revertedWith(
        "Reveal bounty must be lower than minimum possible reward pool size"
      );
    });
  });

  describe("setTimeParams()", () => {
    it("sets params", async () => {
      const { race2Uranus } = await loadFixture(deployBasicFixture);

      const blastOffTimes = [1, 2, 3];
      const revealDelayMinutes = 123;
      const blockTimeMillis = 456;

      await race2Uranus.setTimeParams({
        blastOffTimes,
        revealDelayMinutes,
        blockTimeMillis,
      });

      const [params] = await race2Uranus.functions.getTimeParams();

      expect(params.blastOffTimes).to.deep.equal(blastOffTimes);
      expect(params.revealDelayMinutes).to.equal(revealDelayMinutes);
      expect(params.blockTimeMillis).to.equal(blockTimeMillis);
    });

    it("validates blast off times", async () => {
      const { race2Uranus } = await loadFixture(deployBasicFixture);

      const over1Day = 25 * 60 * 60;

      const blastOffTimes = [1, over1Day];
      const revealDelayMinutes = 123;
      const blockTimeMillis = 456;

      await expect(
        race2Uranus.setTimeParams({
          blastOffTimes,
          revealDelayMinutes,
          blockTimeMillis,
        })
      ).to.be.revertedWith("All blast off times must be within 1 day period");
    });

    it("accepts blast off time near 24 hours", async () => {
      const { race2Uranus } = await loadFixture(deployBasicFixture);

      const almost24Hours = Math.floor(23.9 * 60 * 60);

      const blastOffTimes = [1, almost24Hours];
      const revealDelayMinutes = 123;
      const blockTimeMillis = 456;

      await race2Uranus.setTimeParams({
        blastOffTimes,
        revealDelayMinutes,
        blockTimeMillis,
      });
    });

    it("does NOT allow non-admins to set params", async () => {
      const { rocketeerAlice } = await deployFixtureWithActors();

      await expect(
        rocketeerAlice.race2Uranus.setTimeParams({
          blastOffTimes: [1],
          revealDelayMinutes: 12,
          blockTimeMillis: 34,
        })
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("createRace()", () => {
    it("creates a race", async () => {
      const { race2Uranus } = await loadFixture(deployBasicFixture);
      const expectedRaceId = "0";

      await race2Uranus.createRace();
      const [race] = await race2Uranus.getRace(expectedRaceId);

      expect(race).to.exist;
    });

    it("rejects non-owners", async () => {
      const { rocketeerAlice } = await deployFixtureWithActors();

      expect(
        rocketeerAlice.race2Uranus.functions.createRace()
      ).to.eventually.throw(/caller is not the owner/);
    });

    it("increments race id", async () => {
      const { race2Uranus } = await loadFixture(deployBasicFixture);
      const firstRaceId = "0";
      const secondRaceId = "1";
      const thirdRaceId = "2";

      await race2Uranus.createRace();
      await race2Uranus.createRace();
      await race2Uranus.createRace();
      const [firstRace] = await race2Uranus.functions.getRace(firstRaceId);
      const [secondRace] = await race2Uranus.functions.getRace(secondRaceId);
      const [thirdRace] = await race2Uranus.functions.getRace(thirdRaceId);

      expect(firstRace).to.exist;
      expect(secondRace).to.exist;
      expect(thirdRace).to.exist;
    });

    it("emits RaceCreated event", async () => {
      const { race2Uranus } = await loadFixture(deployBasicFixture);
      const expectedRaceId = "0";

      await expect(race2Uranus.createRace())
        .to.emit(race2Uranus, "RaceCreated")
        .withArgs(expectedRaceId);
    });

    it("puts race id in activeRaceIds array", async () => {
      const { race2Uranus, admin } = await deployFixtureWithActors();

      const { race } = await createRace({ admin });

      const [activeRaceIds] = await race2Uranus.functions.getActiveRaceIds();

      expect(activeRaceIds.length).to.equal(1);
      expect(activeRaceIds.find((id) => id.eq(race.id))).to.exist;

      const { race: race2 } = await createRace({ admin });

      const [activeRaceIds2] = await race2Uranus.functions.getActiveRaceIds();

      expect(activeRaceIds2.length).to.equal(2);
      expect(activeRaceIds2.find((id) => id.eq(race2.id))).to.exist;
    });

    it("does not change config snapshot if base config changes", async () => {
      const { race2Uranus, race } = await deployFixtureWithRace();

      const newMaxRockets = race.configSnapshot.maxRockets + 11;
      const newConfig = {
        ...race.configSnapshot,
        maxRockets: newMaxRockets,
      };

      await race2Uranus.setRaceConfig(newConfig);
      const [raceConfig] = await race2Uranus.functions.getRaceConfig();

      const [raceAfterConfigUpdate] = await race2Uranus.functions.getRace(
        race.id
      );

      expect(raceAfterConfigUpdate.configSnapshot).to.deep.equal(
        race.configSnapshot
      );
      expect(raceConfig.maxRockets).to.equal(newMaxRockets);
      expect(raceAfterConfigUpdate.configSnapshot.maxRockets).not.to.equal(
        raceConfig.maxRockets
      );
    });

    it("throws when trying to access non-existing race", async () => {
      const { race2Uranus, race } = await deployFixtureWithRace();

      const existingRaceId = race.id;
      const nonExistingRaceId = race.id.add("1");

      await race2Uranus.functions.getRace(existingRaceId);

      const nonExistentRaceIdPromise =
        race2Uranus.functions.getRace(nonExistingRaceId);

      await expect(nonExistentRaceIdPromise).to.be.revertedWithPanic(
        ARRAY_OUT_OF_BOUNDS_PANIC_CODE
      );
    });
  });

  describe("enterRace()", () => {
    it("allows to enter a race", async () => {
      const { race, rocketeerAlice } = await deployFixtureWithRace();

      await rocketeerAlice.race2Uranus.enterRace(
        race.id,
        rocketeerAlice.nft.address,
        rocketeerAlice.nftIds[0],
        race.configSnapshot.minStakeAmount
      );

      const [rockets] =
        await rocketeerAlice.race2Uranus.functions.getRocketsForRace(race.id);
      const matchedRocked = rockets.find(
        (r: Race2Uranus.RocketStruct) =>
          r.rocketeer === rocketeerAlice.address &&
          r.nft === rocketeerAlice.nft.address &&
          ethers.BigNumber.from(r.nftId).eq(rocketeerAlice.nftIds[0])
      );

      expect(matchedRocked).to.exist;
    });

    it("allows the same user to enter multiple times with different NFTs", async () => {
      const { race, rocketeerAlice } = await deployFixtureWithRace();

      await rocketeerAlice.race2Uranus.enterRace(
        race.id,
        rocketeerAlice.nft.address,
        rocketeerAlice.nftIds[0],
        race.configSnapshot.minStakeAmount
      );

      const enterRacePromise = rocketeerAlice.race2Uranus.enterRace(
        race.id,
        rocketeerAlice.nft.address,
        rocketeerAlice.nftIds[1],
        race.configSnapshot.minStakeAmount
      );

      await expect(enterRacePromise).not.to.be.reverted;
    });

    it("rejects non-whitelisted nfts", async () => {
      const { race, rocketeerAlice } = await deployFixtureWithRace();

      const randomAddr = ethers.Wallet.createRandom();

      const enterRacePromise = rocketeerAlice.race2Uranus.enterRace(
        race.id,
        randomAddr.address,
        rocketeerAlice.nftIds[0],
        race.configSnapshot.minStakeAmount
      );

      await expect(enterRacePromise).to.be.revertedWith(
        "You cannot use this NFT to enter the race"
      );
    });

    it("starts the race when last rocket joins", async () => {
      const {
        race2Uranus,
        race,
        rocketeerAlice,
        rocketeerBob,
        rocketeerCarol,
      } = await deployFixtureWithRace();

      expect(race.configSnapshot.maxRockets).to.equal(3);

      await rocketeerAlice.race2Uranus.enterRace(
        race.id,
        rocketeerAlice.nft.address,
        rocketeerAlice.nftIds[0],
        race.configSnapshot.minStakeAmount
      );
      await rocketeerBob.race2Uranus.enterRace(
        race.id,
        rocketeerBob.nft.address,
        rocketeerBob.nftIds[0],
        race.configSnapshot.minStakeAmount
      );

      await expect(
        rocketeerCarol.race2Uranus.enterRace(
          race.id,
          rocketeerCarol.nft.address,
          rocketeerCarol.nftIds[0],
          race.configSnapshot.minStakeAmount
        )
      ).to.emit(race2Uranus, "RaceStarted");

      const [updatedRace] = await race2Uranus.functions.getRace(race.id);

      expect(updatedRace.started).to.equal(true);
      expect(updatedRace.blastOffTimestamp).to.be.greaterThan("0");
      expect(updatedRace.revealBlock).to.be.greaterThan("0");
    });

    it("does NOT allow to enter race with full roster", async () => {
      const { race, rocketeerAlice } = await deployFixtureWithFilledRace();

      const enterRacePromise = rocketeerAlice.race2Uranus.enterRace(
        race.id,
        rocketeerAlice.nft.address,
        rocketeerAlice.nftIds.length - 1,
        race.configSnapshot.minStakeAmount
      );

      await expect(enterRacePromise).to.be.revertedWith("Race already started");
    });

    it("rejects NFTs user doesn't own", async () => {
      const { race, rocketeerAlice } = await deployFixtureWithRace();

      const enterRacePromise = rocketeerAlice.race2Uranus.enterRace(
        race.id,
        rocketeerAlice.nft.address,
        rocketeerAlice.nftIds.length + 1,
        race.configSnapshot.minStakeAmount
      );

      await expect(enterRacePromise).to.be.revertedWith(
        "You do not own this nft"
      );
    });

    it("does NOT allow to enter race if it's already finished", async () => {
      const { race, rocketeerAlice } = await deployFixtureWithFinishedRace();

      const enterRacePromise = rocketeerAlice.race2Uranus.enterRace(
        race.id,
        rocketeerAlice.nft.address,
        rocketeerAlice.nftIds.length,
        race.configSnapshot.minStakeAmount
      );

      await expect(enterRacePromise).to.be.revertedWith(
        "Race already finished"
      );
    });

    it("emits RaceEntered event", async () => {
      const { race2Uranus, race, rocketeerAlice } =
        await deployFixtureWithRace();

      const enterRacePromise = rocketeerAlice.race2Uranus.enterRace(
        race.id,
        rocketeerAlice.nft.address,
        rocketeerAlice.nftIds[0],
        race.configSnapshot.minStakeAmount
      );

      await expect(enterRacePromise)
        .to.emit(race2Uranus, "RaceEntered")
        .withArgs(
          race.id,
          0,
          rocketeerAlice.address,
          rocketeerAlice.nft.address,
          rocketeerAlice.nftIds[0]
        );
    });

    it("emits StakedOnRocket event", async () => {
      const { race2Uranus, race, rocketeerAlice } =
        await deployFixtureWithRace();

      const enterRacePromise = rocketeerAlice.race2Uranus.enterRace(
        race.id,
        rocketeerAlice.nft.address,
        rocketeerAlice.nftIds[0],
        race.configSnapshot.minStakeAmount
      );

      await expect(enterRacePromise)
        .to.emit(race2Uranus, "StakedOnRocket")
        .withArgs(
          race.id,
          0,
          rocketeerAlice.address,
          race.configSnapshot.minStakeAmount
        );
    });
  });

  describe("stakeOnRocket()", () => {
    it("allows to stake on rocket", async () => {
      const { race, stakerDan, entrant } = await deployFixtureWithEnteredRace();

      const stakeAmount = race.configSnapshot.minStakeAmount.add(
        ethers.utils.parseEther("1")
      );

      await stakerDan.race2Uranus.functions.stakeOnRocket(
        race.id,
        entrant.rocket.id,
        stakeAmount
      );

      const [raceAfterStake] = await stakerDan.race2Uranus.functions.getRace(
        race.id
      );

      expect(raceAfterStake.rewardPool).to.be.greaterThanOrEqual(stakeAmount);

      const [rocketAfterStake] =
        await stakerDan.race2Uranus.functions.getRocketForRace(
          race.id,
          entrant.rocket.id
        );

      expect(rocketAfterStake.totalStake).to.be.greaterThanOrEqual(stakeAmount);

      const [stakeAmountContract] =
        await stakerDan.race2Uranus.functions.getStakeAmountForStaker(
          race.id,
          entrant.rocket.id,
          stakerDan.address
        );

      expect(stakeAmountContract).to.be.equal(stakeAmount);
    });

    it("does NOT allow to stake on nonexistent rocket", async () => {
      const { race, stakerDan, entrant } = await deployFixtureWithEnteredRace();

      const stakePromise = stakerDan.race2Uranus.functions.stakeOnRocket(
        race.id,
        entrant.rocket.id + 1,
        race.configSnapshot.minStakeAmount
      );

      await expect(stakePromise).to.be.revertedWithPanic(
        ARRAY_OUT_OF_BOUNDS_PANIC_CODE
      );
    });

    it("does NOT allow to stake on nonexistent race", async () => {
      const { race, stakerDan, entrant } = await deployFixtureWithEnteredRace();

      const stakePromise = stakerDan.race2Uranus.functions.stakeOnRocket(
        race.id.add("1"),
        entrant.rocket.id,
        race.configSnapshot.minStakeAmount
      );

      await expect(stakePromise).to.be.revertedWithPanic(
        ARRAY_OUT_OF_BOUNDS_PANIC_CODE
      );
    });

    it("enforces min stake amount", async () => {
      const { race, stakerDan, entrant } = await deployFixtureWithEnteredRace();

      const stakePromise = stakerDan.race2Uranus.functions.stakeOnRocket(
        race.id,
        entrant.rocket.id,
        race.configSnapshot.minStakeAmount.sub("1")
      );

      await expect(stakePromise).to.be.revertedWith("Stake amount too low");
    });

    it("enforces max stake amount", async () => {
      const { race, stakerDan, entrant } = await deployFixtureWithEnteredRace();

      const stakePromise = stakerDan.race2Uranus.functions.stakeOnRocket(
        race.id,
        entrant.rocket.id,
        race.configSnapshot.maxStakeAmount.add("1")
      );

      await expect(stakePromise).to.be.revertedWith("Stake amount too high");
    });

    it("transfers stake amount to self", async () => {
      const { race2Uranus, magic, race, stakerDan, entrant } =
        await deployFixtureWithEnteredRace();

      const stakeAmount = race.configSnapshot.minStakeAmount.add("123");

      const stakerBalanceBefore = await magic.balanceOf(stakerDan.address);
      const contractBalanceBefore = await magic.balanceOf(race2Uranus.address);

      await stakerDan.race2Uranus.functions.stakeOnRocket(
        race.id,
        entrant.rocket.id,
        stakeAmount
      );

      const stakerBalanceAfter = await magic.balanceOf(stakerDan.address);
      const contractBalanceAfter = await magic.balanceOf(race2Uranus.address);

      expect(stakerBalanceBefore.sub(stakerBalanceAfter)).to.equal(stakeAmount);
      expect(contractBalanceAfter.sub(contractBalanceBefore)).to.equal(
        stakeAmount
      );
    });

    it("does NOT allow to stake on finished race", async () => {
      const { race, stakerDan } = await deployFixtureWithFinishedRace();

      const stakePromise = stakerDan.race2Uranus.functions.stakeOnRocket(
        race.id,
        "0",
        race.configSnapshot.maxStakeAmount
      );

      await expect(stakePromise).to.be.revertedWith("Race already finished");
    });
  });

  describe("applyBoost()", () => {
    it("allows to apply boost", async () => {
      const { race, stakerDan, entrant } = await deployFixtureWithEnteredRace();

      await stakerDan.race2Uranus.functions.applyBoost(
        race.id,
        entrant.rocket.id
      );
    });

    it("does NOT allow to apply boost on nonexistent rocket", async () => {
      const { race, stakerDan, entrant } = await deployFixtureWithEnteredRace();

      const boostPromise = stakerDan.race2Uranus.functions.applyBoost(
        race.id,
        entrant.rocket.id + 1
      );

      await expect(boostPromise).to.be.revertedWithPanic(
        ARRAY_OUT_OF_BOUNDS_PANIC_CODE
      );
    });

    it("does NOT allow to apply boost on nonexistent race", async () => {
      const { race, stakerDan, entrant } = await deployFixtureWithEnteredRace();

      const boostPromise = stakerDan.race2Uranus.functions.applyBoost(
        race.id.add("1"),
        entrant.rocket.id
      );

      await expect(boostPromise).to.be.revertedWithPanic(
        ARRAY_OUT_OF_BOUNDS_PANIC_CODE
      );
    });

    it("transfers boost price to self", async () => {
      const { race2Uranus, magic, race, stakerDan, entrant } =
        await deployFixtureWithEnteredRace();

      const stakerBalanceBefore = await magic.balanceOf(stakerDan.address);
      const gameBalanceBefore = await magic.balanceOf(race2Uranus.address);

      await stakerDan.race2Uranus.functions.applyBoost(
        race.id,
        entrant.rocket.id
      );

      const stakerBalanceAfter = await magic.balanceOf(stakerDan.address);
      const gameBalanceAfter = await magic.balanceOf(race2Uranus.address);

      expect(stakerBalanceBefore.sub(stakerBalanceAfter)).to.equal(
        race.configSnapshot.boostPrice
      );
      expect(gameBalanceAfter.sub(gameBalanceBefore)).to.equal(
        race.configSnapshot.boostPrice
      );
    });

    it("adds boost price to reward pool", async () => {
      const { race2Uranus, race, stakerDan, entrant } =
        await deployFixtureWithEnteredRace();

      const [raceBefore] = await race2Uranus.functions.getRace(race.id);
      const rewardPoolBefore = raceBefore.rewardPool;

      await stakerDan.race2Uranus.functions.applyBoost(
        race.id,
        entrant.rocket.id
      );

      const [raceAfter] = await race2Uranus.functions.getRace(race.id);
      const rewardPoolAfter = raceAfter.rewardPool;

      expect(rewardPoolAfter.sub(rewardPoolBefore)).to.equal(
        race.configSnapshot.boostPrice
      );
    });

    it("emits BoostApplied event", async () => {
      const { race2Uranus, race, stakerDan, entrant } =
        await deployFixtureWithEnteredRace();

      const boostPromise = stakerDan.race2Uranus.functions.applyBoost(
        race.id,
        entrant.rocket.id
      );

      await expect(boostPromise)
        .to.emit(race2Uranus, "BoostApplied")
        .withArgs(race.id, 0, stakerDan.address);
    });

    it("does NOT allow to boost rockets in finished race", async () => {
      const { race, stakerDan } = await deployFixtureWithFinishedRace();

      const boostPromise = stakerDan.race2Uranus.functions.applyBoost(
        race.id,
        "0"
      );

      await expect(boostPromise).to.be.revertedWith("Race already finished");
    });
  });

  describe("_calcRevealTimestamp()", () => {
    interface IRevealTimestampTestCase {
      currentTimestamp: number;
      blastOffTimes: number[];
      revealDelayMinutes: number;
      expectedTimestamp: number;
    }

    const SECOND = 1;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;

    const startOfDay = moment.tz("UTC").startOf("day");

    function getTimestamp(day = 0, hour = 0, minute = 0, second = 0) {
      return Math.floor(
        startOfDay
          .clone()
          .add(day, "days")
          .add(hour, "hours")
          .add(minute, "minutes")
          .add(second, "seconds")
          .toDate()
          .getTime() / 1000
      );
    }

    function getBlastOffTime(hour = 0, minute = 0, second = 0) {
      return hour * HOUR + minute * MINUTE + second * SECOND;
    }

    function formatBlastOffTime(time: number) {
      let _time = time;
      const hours = Math.floor(_time / HOUR);
      _time -= hours * HOUR;

      const minutes = Math.floor(_time / MINUTE);
      _time -= minutes * MINUTE;

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}.${String(_time).padStart(2, "0")}`;
    }

    function isoString(timestamp: number) {
      return new Date(timestamp * 1000).toISOString();
    }

    it("calculates reveal timestamp", async () => {
      const { race2Uranus } = await loadFixture(deployBasicFixture);

      const testCases: IRevealTimestampTestCase[] = [
        {
          currentTimestamp: getTimestamp(0, 12),
          blastOffTimes: [getBlastOffTime(13)],
          revealDelayMinutes: 10,
          expectedTimestamp: getTimestamp(0, 13, 10),
        },
        {
          currentTimestamp: getTimestamp(0, 14),
          blastOffTimes: [getBlastOffTime(13)],
          revealDelayMinutes: 10,
          expectedTimestamp: getTimestamp(1, 13, 10),
        },
        {
          currentTimestamp: getTimestamp(0, 14),
          blastOffTimes: [getBlastOffTime(13), getBlastOffTime(15)],
          revealDelayMinutes: 10,
          expectedTimestamp: getTimestamp(0, 15, 10),
        },
        {
          currentTimestamp: getTimestamp(0, 14),
          blastOffTimes: [getBlastOffTime(14), getBlastOffTime(14, 10)],
          revealDelayMinutes: 10,
          expectedTimestamp: getTimestamp(0, 14, 20),
        },
        {
          currentTimestamp: getTimestamp(0, 23),
          blastOffTimes: [getBlastOffTime(23, 5), getBlastOffTime(23, 10)],
          revealDelayMinutes: 10,
          expectedTimestamp: getTimestamp(0, 23, 15),
        },
        {
          currentTimestamp: getTimestamp(0, 4, 20, 6),
          blastOffTimes: [
            getBlastOffTime(1, 15, 5),
            getBlastOffTime(2, 15, 5),
            getBlastOffTime(3, 15, 5),
          ],
          revealDelayMinutes: 10,
          expectedTimestamp: getTimestamp(1, 1, 25, 5),
        },
      ];

      for (const {
        currentTimestamp,
        blastOffTimes,
        revealDelayMinutes,
        expectedTimestamp,
      } of testCases) {
        const { blastOffTimestamp } =
          await race2Uranus.functions._calcClosestBlastOffTimestamp(
            currentTimestamp,
            blastOffTimes
          );
        const { revealTimestamp } =
          await race2Uranus.functions._calcRevealTimestamp(
            blastOffTimestamp,
            revealDelayMinutes
          );

        expect(isoString(revealTimestamp.toNumber())).to.equal(
          isoString(expectedTimestamp)
        );
      }
    });
  });

  describe("startRace()", () => {
    it("does NOT start race without full roster", async () => {
      const { race, stakerDan } = await deployFixtureWithEnteredRace();

      await expect(
        stakerDan.race2Uranus.functions.startRace(race.id)
      ).to.be.revertedWith("Race can only be started with full roster");
    });

    it("does NOT start already started race", async () => {
      const { race, stakerDan } = await deployFixtureWithFilledRace();

      await expect(
        stakerDan.race2Uranus.functions.startRace(race.id)
      ).to.be.revertedWith("Race already started");
    });

    it("does NOT start already finished race", async () => {
      const { race, stakerDan } = await deployFixtureWithFinishedRace();

      await expect(
        stakerDan.race2Uranus.functions.startRace(race.id)
      ).to.be.revertedWith("Race already finished");
    });
  });

  describe("finishRace()", () => {
    function calcRewardsAndFees({
      rewardPool,
      raceConfig,
      poolForWinner,
      stakeForWinner,
    }: {
      rewardPool: BigNumber;
      raceConfig: Race2Uranus.RaceConfigStructOutput;
      poolForWinner?: BigNumber;
      stakeForWinner?: BigNumber;
    }): {
      devFee: BigNumber;
      winningRocketReward: BigNumber;
      otherRocketsReward: BigNumber;
      rewardPerShare: BigNumber;
      stakerReward: BigNumber;
      totalRewards: BigNumber;
      totalRewardsAndFees: BigNumber;
    } {
      let _rewardPool = rewardPool.sub(raceConfig.revealBounty);
      const devFee = _rewardPool.mul(raceConfig.devFeePercent).div(100);
      _rewardPool = _rewardPool.sub(devFee);
      let winningRocketReward = BigNumber.from("0");
      let otherRocketsReward = BigNumber.from("0");
      let stakerReward = BigNumber.from("0");

      const rocketsShare = _rewardPool
        .mul(raceConfig.rocketsSharePercent || 0)
        .div(100);
      winningRocketReward = rocketsShare
        .mul(raceConfig.winningRocketSharePercent || 0)
        .div(100);
      otherRocketsReward = rocketsShare
        .sub(winningRocketReward)
        .div((raceConfig.maxRockets || 3) - 1);
      _rewardPool = _rewardPool.sub(rocketsShare);

      const rewardPerShare = _rewardPool
        .mul(ethers.utils.parseEther("1"))
        .div(poolForWinner || 1);
      stakerReward = rewardPerShare.mul(stakeForWinner || 0);

      const totalRewards = rewardPerShare
        .mul(poolForWinner || 0)
        .div(ethers.utils.parseEther("1"))
        .add(winningRocketReward)
        .add(otherRocketsReward.mul((raceConfig.maxRockets || 1) - 1));

      const totalRewardsAndFees = totalRewards
        .add(devFee)
        .add(raceConfig.revealBounty);

      return {
        devFee,
        winningRocketReward,
        otherRocketsReward,
        rewardPerShare,
        stakerReward,
        totalRewards,
        totalRewardsAndFees,
      };
    }

    it("finishes race", async () => {
      const { stakerDan, race } = await deployFixtureWithFilledRace();
      await mineBlocksUntil(race.revealBlock.toNumber());

      await stakerDan.race2Uranus.functions.finishRace(race.id);

      const [updatedRace] = await stakerDan.race2Uranus.functions.getRace(
        race.id
      );

      expect(updatedRace.finished).to.equal(true);
    });

    it("does NOT finish newly created race", async () => {
      const { stakerDan, race } = await deployFixtureWithRace();

      await expect(
        stakerDan.race2Uranus.functions.finishRace(race.id)
      ).to.be.revertedWith("Race must be started first");
    });

    it("does NOT finish race without full roster", async () => {
      const { stakerDan, race } = await deployFixtureWithEnteredRace();

      await expect(
        stakerDan.race2Uranus.functions.finishRace(race.id)
      ).to.be.revertedWith("Race must be started first");
    });

    it("does NOT finish race before reveal block", async () => {
      const { stakerDan, race } = await deployFixtureWithFilledRace();

      await expect(
        stakerDan.race2Uranus.functions.finishRace(race.id)
      ).to.be.revertedWith(
        "Race can only be finished after revealBlock has been mined"
      );
    });

    it("does NOT finish already finished race", async () => {
      const { stakerDan, race } = await deployFixtureWithFilledRace();
      await mineBlocksUntil(race.revealBlock.toNumber());
      await stakerDan.race2Uranus.functions.finishRace(race.id);

      await expect(
        stakerDan.race2Uranus.functions.finishRace(race.id)
      ).to.be.revertedWith("Race already finished");
    });

    it("disburses reveal bounty", async () => {
      const { magic, race2Uranus, stakerDan, race } =
        await deployFixtureWithFilledRace();
      await mineBlocksUntil(race.revealBlock.toNumber());

      const contractBalanceBefore = await magic.balanceOf(race2Uranus.address);
      const stakerBalanceBefore = await magic.balanceOf(stakerDan.address);

      await stakerDan.race2Uranus.functions.finishRace(race.id);

      const contractBalanceAfter = await magic.balanceOf(race2Uranus.address);
      const stakerBalanceAfter = await magic.balanceOf(stakerDan.address);

      expect(contractBalanceBefore.sub(contractBalanceAfter)).to.equal(
        race.configSnapshot.revealBounty
      );
      expect(stakerBalanceAfter.sub(stakerBalanceBefore)).to.equal(
        race.configSnapshot.revealBounty
      );
    });

    it("emits RaceFinished event", async () => {
      const { race2Uranus, stakerDan, race } =
        await deployFixtureWithFilledRace();
      await mineBlocksUntil(race.revealBlock.toNumber());

      await expect(stakerDan.race2Uranus.functions.finishRace(race.id)).to.emit(
        race2Uranus,
        "RaceFinished"
      );
    });

    it("disburses dev fee", async () => {
      const { race2Uranus, magic, stakerDan, race } =
        await deployFixtureWithFilledRace();
      await stakeOnRocket({
        staker: stakerDan,
        raceId: race.id,
        rocketId: 0,
        amount: race.configSnapshot.minStakeAmount.mul(100),
      });
      await mineBlocksUntil(race.revealBlock.toNumber());

      const [updatedRace] = await race2Uranus.functions.getRace(race.id);
      const { rewardPool } = updatedRace;

      const { devFee } = calcRewardsAndFees({
        rewardPool,
        raceConfig: race.configSnapshot,
      });

      const contractBalanceBefore = await magic.balanceOf(race2Uranus.address);
      const beneficiaryBalanceBefore = await magic.balanceOf(
        beneficiary.address
      );

      await stakerDan.race2Uranus.functions.finishRace(race.id);

      const contractBalanceAfter = await magic.balanceOf(race2Uranus.address);
      const beneficiaryBalanceAfter = await magic.balanceOf(
        beneficiary.address
      );

      expect(contractBalanceBefore.sub(contractBalanceAfter)).to.equal(
        devFee.add(race.configSnapshot.revealBounty)
      );
      expect(beneficiaryBalanceAfter.sub(beneficiaryBalanceBefore)).to.equal(
        devFee
      );
    });

    it("sum of all rewards does not go above balance", async () => {
      const { race2Uranus, magic, stakerDan, race } =
        await deployFixtureWithFilledRace();
      const rocketId = 0;
      const stakeToAdd = race.configSnapshot.minStakeAmount.mul(100);
      await stakeOnRocket({
        staker: stakerDan,
        raceId: race.id,
        rocketId,
        amount: stakeToAdd,
      });
      const [rocket] = await race2Uranus.functions.getRocketForRace(
        race.id,
        rocketId
      );
      await mineBlocksUntil(race.revealBlock.toNumber());

      const [raceBeforeFinish] = await race2Uranus.functions.getRace(race.id);
      const { rewardPool } = raceBeforeFinish;

      const { totalRewards, totalRewardsAndFees } = calcRewardsAndFees({
        rewardPool,
        raceConfig: race.configSnapshot,
        poolForWinner: rocket.totalStake,
        stakeForWinner: stakeToAdd,
      });

      const contractBalanceBefore = await magic.balanceOf(race2Uranus.address);

      await stakerDan.race2Uranus.functions.finishRace(race.id);

      const [raceAfterFinish] = await race2Uranus.functions.getRace(race.id);

      const contractBalanceAfter = await magic.balanceOf(race2Uranus.address);

      expect(raceAfterFinish.rewardPool).to.be.lessThan(
        raceBeforeFinish.rewardPool
      );
      expect(contractBalanceBefore).to.be.within(
        totalRewardsAndFees.sub(100),
        raceBeforeFinish.rewardPool
      );
      expect(contractBalanceAfter).to.be.within(
        totalRewards.sub(100),
        raceAfterFinish.rewardPool
      );
    });
  });

  describe("claimAll()", () => {
    it("allows stakers to claim", async () => {
      const { magic, race2Uranus, stakerDan } =
        await deployFixtureWithFinishedRace();

      const contractBalanceBefore = await magic.balanceOf(race2Uranus.address);
      const stakerBalanceBefore = await magic.balanceOf(stakerDan.address);

      const [rewards] =
        await stakerDan.race2Uranus.functions.calcClaimableAmountAll(
          stakerDan.address
        );
      await stakerDan.race2Uranus.functions.claimAll();

      const contractBalanceAfter = await magic.balanceOf(race2Uranus.address);
      const stakerBalanceAfter = await magic.balanceOf(stakerDan.address);

      expect(stakerBalanceAfter.sub(stakerBalanceBefore)).to.equal(rewards);
      expect(contractBalanceBefore.sub(contractBalanceAfter)).to.equal(rewards);
    });

    it("allows rocketeers to claim", async () => {
      const { magic, race2Uranus, rocketeerAlice } =
        await deployFixtureWithFinishedRace();

      const contractBalanceBefore = await magic.balanceOf(race2Uranus.address);
      const rocketeerBalanceBefore = await magic.balanceOf(
        rocketeerAlice.address
      );

      const [rewards] =
        await rocketeerAlice.race2Uranus.functions.calcClaimableAmountAll(
          rocketeerAlice.address
        );
      await rocketeerAlice.race2Uranus.functions.claimAll();

      const contractBalanceAfter = await magic.balanceOf(race2Uranus.address);
      const rocketeerBalanceAfter = await magic.balanceOf(
        rocketeerAlice.address
      );

      expect(rewards).to.be.greaterThan(BigNumber.from("0"));
      expect(rocketeerBalanceAfter.sub(rocketeerBalanceBefore)).to.equal(
        rewards
      );
      expect(contractBalanceBefore.sub(contractBalanceAfter)).to.equal(rewards);
    });

    it("allows everyone to claim and does not run out of money", async () => {
      const {
        magic,
        race2Uranus,
        rocketeerAlice,
        rocketeerBob,
        rocketeerCarol,
        stakerDan,
        stakerErin,
        stakerFrank,
      } = await deployFixtureWithFinishedRace();

      const contractBalanceBefore = await magic.balanceOf(race2Uranus.address);

      let totalClaimedRewards = BigNumber.from("0");

      await Promise.all(
        [
          rocketeerAlice,
          rocketeerBob,
          rocketeerCarol,
          stakerDan,
          stakerErin,
          stakerFrank,
        ].map(async (actor) => {
          const actorBalanceBefore = await magic.balanceOf(actor.address);
          await actor.race2Uranus.functions.claimAll();
          const actorBalanceAfter = await magic.balanceOf(actor.address);

          const balanceDiff = actorBalanceAfter.sub(actorBalanceBefore);

          totalClaimedRewards = totalClaimedRewards.add(balanceDiff);
        })
      );

      const contractBalanceAfter = await magic.balanceOf(race2Uranus.address);

      expect(contractBalanceAfter).to.be.within(
        BigNumber.from("0"),
        BigNumber.from("100")
      );

      expect(totalClaimedRewards).to.be.within(
        contractBalanceBefore.sub("100"),
        contractBalanceBefore
      );
    });

    it("lets rocketeers claim only once", async () => {
      const { magic, rocketeerAlice, rocketeerBob, rocketeerCarol } =
        await deployFixtureWithFinishedRace();

      await Promise.all(
        [rocketeerAlice, rocketeerBob, rocketeerCarol].map(async (actor) => {
          const actorBalanceBefore = await magic.balanceOf(actor.address);
          await actor.race2Uranus.functions.claimAll();
          const actorBalanceAfterClaim1 = await magic.balanceOf(actor.address);

          const balanceDiffClaim1 =
            actorBalanceAfterClaim1.sub(actorBalanceBefore);

          expect(balanceDiffClaim1).to.be.greaterThan(BigNumber.from("0"));

          const actorBalanceAfterClaim2 = await magic.balanceOf(actor.address);

          const balanceDiffClaim2 = actorBalanceAfterClaim2.sub(
            actorBalanceAfterClaim1
          );

          expect(balanceDiffClaim2).to.equal(BigNumber.from("0"));
        })
      );
    });

    it("lets stakers claim only once", async () => {
      const { magic, stakerDan, stakerErin, stakerFrank } =
        await deployFixtureWithFinishedRace();

      await Promise.all(
        [stakerDan, stakerErin, stakerFrank].map(async (actor) => {
          const actorBalanceBefore = await magic.balanceOf(actor.address);
          await actor.race2Uranus.functions.claimAll();
          const actorBalanceAfterClaim1 = await magic.balanceOf(actor.address);

          const balanceDiffClaim1 =
            actorBalanceAfterClaim1.sub(actorBalanceBefore);

          expect(balanceDiffClaim1).to.be.greaterThanOrEqual(
            BigNumber.from("0")
          );

          const actorBalanceAfterClaim2 = await magic.balanceOf(actor.address);

          const balanceDiffClaim2 = actorBalanceAfterClaim2.sub(
            actorBalanceAfterClaim1
          );

          expect(balanceDiffClaim2).to.equal(BigNumber.from("0"));
        })
      );
    });
  });
});
