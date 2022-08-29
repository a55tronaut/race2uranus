import { SECOND_MILLIS } from '../constants';
import { createLogger } from '../logger';
import { RaceFinishedEvent, RaceStartedEvent } from '../types';
import { sleep } from '../utils';
import { provider } from './provider';
import { race2Uranus } from './race2Uranus';

interface IWatchedRace {
  raceId: string;
  revealBlock: number;
}

let watchedRaces: IWatchedRace[] = [];

const MAX_BLOCK_DELAY = 200;
const logger = createLogger('service:revealWatcher');

initRevealWatcher();

async function initRevealWatcher() {
  checkRacesPeriodically();
  watchRaceStartedEvents();
  watchRaceFinishedEvents();
  fetchActiveRaces();
}

async function checkRacesPeriodically() {
  try {
    await Promise.all([checkRaces(), sleep(10 * SECOND_MILLIS)]);
  } catch (e) {
    logger.error(e);
  }
  checkRacesPeriodically();
}

async function checkRaces() {
  if (watchedRaces.length === 0) {
    logger.debug(`No races to check`);
    return;
  }
  const currentBlock = await provider.getBlockNumber();
  logger.debug(`Checking ${watchedRaces.length} races (current block is ${currentBlock})...`);

  for (const race of watchedRaces) {
    const thresholdBlock = race.revealBlock + MAX_BLOCK_DELAY;
    if (currentBlock > thresholdBlock) {
      logger.debug(`Race ${race.raceId} has not been finished yet (revealBlock: ${race.revealBlock}), finishing...`);
      await finishRace(race.raceId);
    }
  }
}

async function finishRace(raceId: string) {
  logger.debug(`Finishing race ${raceId}...`);
  try {
    await race2Uranus.functions.finishRace(raceId);
  } catch (err) {
    logger.error(err);
  } finally {
    removeFromWatchedRaces(raceId);
    logger.debug(`Finished race ${raceId}`);
  }
}

async function fetchActiveRaces() {
  logger.debug('Fetching active races...');
  const [ids] = await race2Uranus.functions.getActiveRaceIds();
  logger.debug(`Found ${ids.length} active races. Adding to watcher...`);

  for (const id of ids) {
    const [race] = await race2Uranus.functions.getRace(id);
    if (race.started) {
      addToWatchedRaces({
        raceId: id.toString(),
        revealBlock: race.revealBlock.toNumber(),
      });
    }
  }
}

async function addToWatchedRaces(race: IWatchedRace) {
  if (!watchedRaces.find((r) => r.raceId === race.raceId)) {
    watchedRaces.push(race);
  }
}

async function removeFromWatchedRaces(raceId: string) {
  watchedRaces = watchedRaces.filter((r) => r.raceId !== raceId);
}

async function watchRaceStartedEvents() {
  logger.debug('Adding RaceStarted listener...');
  race2Uranus.on(race2Uranus.filters.RaceStarted(), (...all) => {
    const ev: RaceStartedEvent = all[all.length - 1] as any;
    const raceId = ev.args.raceId.toString();
    const revealBlock = ev.args.revealBlockNumber.toNumber();
    logger.debug(`Received RaceStarted event for race ${raceId}...`);
    addToWatchedRaces({
      raceId,
      revealBlock,
    });
  });
}

async function watchRaceFinishedEvents() {
  logger.debug('Adding RaceFinished listener...');
  race2Uranus.on(race2Uranus.filters.RaceFinished(), (...all) => {
    const ev: RaceFinishedEvent = all[all.length - 1] as any;
    removeFromWatchedRaces(ev.args.raceId.toString());
  });
}
