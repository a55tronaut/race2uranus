import { BigNumberish, ethers } from 'ethers';
import queue from 'queue';
import mongoose, { ClientSession } from 'mongoose';

import { MINUTE_MILLIS } from '../constants';
import { createLogger } from '../logger';
import { UserLeaderboard, LeaderboardRace, NftLeaderboard } from '../models';
import { INftLeaderboardResult, IUserLeaderboardResult, RaceFinishedEvent } from '../types';
import { getFromCacheOrFetch, waitForDb, weiToNumber } from '../utils';
import { race2Uranus } from './race2Uranus';
import { makeErc721Contract } from './erc721';

const MAX_LEADERBOARD_ENTRIES = 1000;
const MAX_LEADERBOARD_RESULTS = 30;
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
    ttlMillis: 3 * MINUTE_MILLIS,
    fetchValue: buildNftLeaderboard,
  });
}

async function buildNftLeaderboard(): Promise<INftLeaderboardResult[]> {
  const entries = await NftLeaderboard.find().sort({ earnings: 'desc' }).limit(MAX_LEADERBOARD_RESULTS);

  return entries.map((entry, i) => ({
    position: i + 1,
    address: entry.address,
    nftId: entry.nftId,
    owner: entry.owner,
    earnings: entry.earnings,
    wins: entry.wins,
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
  const lastSyncedBlock = await getLastSyncedBlock();
  logger.debug(`Last synced block is ${lastSyncedBlock}`);
  const events = await race2Uranus.queryFilter(race2Uranus.filters.RaceFinished(), lastSyncedBlock + 1);
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
  session.startTransaction();

  await updateUserLeaderboard(raceId, session);
  await updateNftLeaderboard(raceId, session);

  await LeaderboardRace.create({ raceId: raceIdStr, blockNumber, session });

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
  const winningRocket = race.rockets[race.winner];

  for (const rocket of race.rockets) {
    const isWinner = rocket.id === winningRocket.id;
    let earnings = 0;
    const wins = isWinner ? 1 : 0;

    if (isWinner) {
      earnings += weiToNumber(race.winningRocketShare);
      const rocketsShare = race.rewardPool.mul(race.configSnapshot.rocketsSharePercent).div(100);
      const stakersShare = race.rewardPool.sub(rocketsShare);
      earnings += weiToNumber(stakersShare);
    } else {
      earnings += weiToNumber(race.otherRocketsShare);
    }

    let owner = '';

    try {
      const contract = makeErc721Contract(rocket.nft);
      owner = await contract.ownerOf(rocket.nftId);
    } catch (e) {
      logger.error(e);
    }

    await NftLeaderboard.findOneAndUpdate(
      { address: rocket.nft, nftId: rocket.nftId.toString() },
      { owner, $inc: { earnings, wins, races: 1 } },
      { upsert: true, session },
    );
  }
}
