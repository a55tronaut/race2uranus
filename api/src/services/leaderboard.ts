import { BigNumberish, ethers } from 'ethers';
import queue from 'queue';
import mongoose, { ClientSession } from 'mongoose';

import { MINUTE_MILLIS } from '../constants';
import { createLogger } from '../logger';
import { UserLeaderboard, LeaderboardRace, NftLeaderboard } from '../models';
import { INftLeaderboardResult, IUserLeaderboardResult, RaceFinishedEvent } from '../types';
import { getFromCacheOrFetch, waitForDb } from '../utils';
import { race2Uranus } from './race2Uranus';
import { makeErc721Contract } from './erc721';

const MAX_LEADERBOARD_ENTRIES = 1000;
const logger = createLogger('service:leaderboard');
const q = queue({ autostart: true, concurrency: 1 });

export const leaderboardService = {
  getUserLeaderboard,
  getUserLeaderboardPosition,
  getNftLeaderboard,
};

initEventWatcher();

async function getUserLeaderboard(): Promise<IUserLeaderboardResult[]> {
  const leaderboard = await getUserLeaderboardLong();
  return leaderboard.slice(0, 50);
}

async function getUserLeaderboardLong(): Promise<IUserLeaderboardResult[]> {
  const cacheKey = 'leaderboard:user:long';
  return getFromCacheOrFetch<IUserLeaderboardResult[]>({
    key: cacheKey,
    ttlMillis: 3 * MINUTE_MILLIS,
    fetchValue: buildUserLeaderboard,
  });
}

async function buildUserLeaderboard(): Promise<IUserLeaderboardResult[]> {
  const entries = await UserLeaderboard.find().sort({ winnings: 'desc' }).limit(MAX_LEADERBOARD_ENTRIES);

  return entries.map((entry, i) => ({
    position: i + 1,
    address: entry.address,
    winnings: entry.winnings,
    races: entry.races,
  }));
}

async function getUserLeaderboardPosition(address: string): Promise<IUserLeaderboardResult> {
  const leaderboard = await getUserLeaderboard();
  const entry = leaderboard.find((item) => item.address === address);
  if (entry) {
    return entry;
  }

  const otherEntry = await UserLeaderboard.findOne({ address });

  if (otherEntry) {
    return {
      address,
      position: -1,
      winnings: otherEntry.winnings,
      races: otherEntry.races,
    };
  }

  return {
    address,
    position: -1,
    winnings: 0,
    races: 0,
  };
}

//////////////////////////////

async function getNftLeaderboard(): Promise<INftLeaderboardResult[]> {
  const cacheKey = 'leaderboard:nft';

  return getFromCacheOrFetch<INftLeaderboardResult[]>({
    key: cacheKey,
    ttlMillis: 10 * MINUTE_MILLIS,
    fetchValue: buildNftLeaderboard,
  });
}

async function buildNftLeaderboard(): Promise<INftLeaderboardResult[]> {
  const leaderboardLong = await getNftLeaderboardLong();
  const leaderboard = leaderboardLong.slice(0, 30);

  for (const item of leaderboard) {
    try {
      const contract = makeErc721Contract(item.address);
      const owner = await contract.ownerOf(item.nftId);
      item.owner = owner;
    } catch (e) {
      logger.error(e);
    }
  }

  return leaderboard;
}

async function getNftLeaderboardLong(): Promise<INftLeaderboardResult[]> {
  const cacheKey = 'leaderboard:nft:long';
  return getFromCacheOrFetch<INftLeaderboardResult[]>({
    key: cacheKey,
    ttlMillis: 10 * MINUTE_MILLIS,
    fetchValue: buildNftLeaderboardLong,
  });
}

async function buildNftLeaderboardLong(): Promise<INftLeaderboardResult[]> {
  const entries = await NftLeaderboard.find().sort({ winnings: 'desc' }).limit(MAX_LEADERBOARD_ENTRIES);

  return entries.map((entry, i) => ({
    position: i + 1,
    address: entry.address,
    nftId: entry.nftId,
    winnings: entry.winnings,
    races: entry.races,
  }));
}

//////////////////////////

async function initEventWatcher() {
  await waitForDb();
  watchRaceFinishedEvents();
  syncPastRaceFinishedEvents();
}

async function syncPastRaceFinishedEvents() {
  logger.debug('Syncing past RaceFinished events...');
  const minBlock = await getLastSyncedBlock();
  logger.debug(`Last synced block is ${minBlock}`);
  const events = await race2Uranus.queryFilter(race2Uranus.filters.RaceFinished(), minBlock);
  logger.debug(`Found ${events.length} RaceFinished events. Processing...`);

  events.forEach(queueProcessRaceFinishedEvent);
}

async function getLastSyncedBlock() {
  const [res] = await LeaderboardRace.find().sort({ blockNumber: 'desc' }).limit(1);
  return res?.blockNumber || 0;
}

async function watchRaceFinishedEvents() {
  logger.debug('Adding RaceFinished listener...');
  race2Uranus.on(race2Uranus.filters.RaceFinished(), (...all) => {
    const ev: RaceFinishedEvent = all[all.length - 1] as any;
    queueProcessRaceFinishedEvent(ev);
  });
}

async function queueProcessRaceFinishedEvent(event: RaceFinishedEvent) {
  logger.debug(`Adding RaceFinished event for raceId ${event.args.raceId} from block ${event.blockNumber} to queue...`);
  q.push(() => processRaceFinishedEvent(event.args.raceId, event.blockNumber));
}

async function processRaceFinishedEvent(raceId: BigNumberish, blockNumber: number) {
  logger.debug(`Processing RaceFinished event for raceId ${raceId} from block ${blockNumber}...`);
  const raceIdStr = ethers.BigNumber.from(raceId).toString();

  if (await isRaceProcessed(raceIdStr)) {
    logger.debug(`RaceId ${raceId} already processed, exiting`);
    return;
  }

  const session = await mongoose.startSession();

  await updateUserLeaderboard(raceId, session);
  await updateNftLeaderboard(raceId, session);

  await LeaderboardRace.create({ raceId: raceIdStr, blockNumber }, { session });

  await session.commitTransaction();
  await session.endSession();

  logger.debug(`Processed raceId ${raceId}`);
}

async function isRaceProcessed(raceId: string) {
  const res = await LeaderboardRace.findOne({ raceId });

  return !!res;
}

async function updateUserLeaderboard(raceId: BigNumberish, session: ClientSession) {
  const [users] = await race2Uranus.functions.getUsersForRaceId(raceId);

  for (const user of users) {
    const { amount } = await race2Uranus.functions.calcClaimableAmount(user, raceId);
    const winnings = Number(ethers.utils.formatEther(amount));
    await UserLeaderboard.findOneAndUpdate(
      { address: user },
      { $inc: { winnings, races: 1 } },
      { upsert: true, session },
    );
  }
}

async function updateNftLeaderboard(raceId: BigNumberish, session: ClientSession) {
  const [race] = await race2Uranus.functions.getRace(raceId);
  const devFee = race.rewardPool.mul(race.configSnapshot.devFeePercent).div(100);
  const rewardPool = race.rewardPool.sub(devFee);
  const rocketsShare = rewardPool.mul(race.configSnapshot.rocketsSharePercent).div(100);
  const winningRocketShare = rocketsShare.mul(race.configSnapshot.winningRocketSharePercent).div(100);
  const winnings = Number(ethers.utils.formatEther(winningRocketShare));
  const winningRocket = race.rockets[race.winner];
  const { nft, nftId } = winningRocket;

  await UserLeaderboard.findOneAndUpdate(
    { address: nft, nftId: nftId.toString() },
    { $inc: { winnings, races: 1 } },
    { upsert: true, session },
  );
}
