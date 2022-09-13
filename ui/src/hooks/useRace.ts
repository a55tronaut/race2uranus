import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useEffect } from 'react';
import create from 'zustand';
import queue from 'queue';
import merge from 'lodash/merge';
import moment from 'moment';

import {
  BoostAppliedEvent,
  IRaceStatusMeta,
  Race2Uranus,
  RaceCreatedEvent,
  RaceEnteredEvent,
  RaceFinishedEvent,
  RaceStartedEvent,
  StakedOnRocketEvent,
  TypedListener,
} from '../types';
import { sleep } from '../utils';
import { SECOND_MILLIS } from '../constants';
import { useRaceContract, useRaceContractStore } from './useRaceContract';

interface IRaceStoreState {
  [key: string]: IRace;
}

interface IRace {
  loading: boolean;
  error: boolean;
  race?: Race2Uranus.RaceStructOutput;
  statusMeta?: IRaceStatusMeta;
}

// this ensures race data for a given id is only loaded once
// relying on zustand to keep track of this does not work because setState is async
// so if this hook is used in more than one place then before zustand updates the data refresh may be triggered multiple times
const knownRaces: { [key: string]: boolean } = {};

const q = queue({ autostart: true, concurrency: 1 });

const defaultState: IRaceStoreState = {};
const defaultRace: IRace = { loading: true, error: false };

const useRaceStore = create<IRaceStoreState>(() => defaultState);

export function useRace(id: BigNumberish): IRace {
  const { contract } = useRaceContract();
  const race = useRaceStore((state) => state[id?.toString()]) || defaultRace;

  useEffect(() => {
    const shouldLoadRace = id && !knownRaces[id.toString()] && contract.functions?.getRace;
    if (shouldLoadRace) {
      knownRaces[id.toString()] = true;
      refreshRaceData();
    }
    async function refreshRaceData() {
      try {
        const [race] = await contract.functions!.getRace(id)!;

        updateRaceInStore(id, { loading: false, race });

        // TODO: remove

        // setTimeout(() => {
        //   console.log('updating blastofftimestamp');
        //   updateRaceStructInStore(id, {
        //     blastOffTimestamp: BigNumber.from(Math.floor(moment().add(5, 'seconds').toDate().getTime() / 1000)),
        //   });
        // }, 5000);
        // setTimeout(() => {
        //   console.log('updating status to inProgress');
        //   updateRaceInStore(id, { statusMeta: { waiting: false, inProgress: true, done: false } });
        // }, 5000);
        // setTimeout(() => {
        //   console.log('updating status to done');
        //   updateRaceInStore(id, { statusMeta: { waiting: false, inProgress: false, done: true } });
        // }, 10000);
      } catch (e) {
        console.error(e);
        updateRaceInStore(id, { loading: false, error: true });
      }
    }
  }, [contract.functions, id, race]);

  return {
    ...race,
  };
}

function calcAndNotifyStatusMeta(
  race: Race2Uranus.RaceStructOutput,
  prevRace?: Race2Uranus.RaceStructOutput
): IRaceStatusMeta {
  const statusMeta = calcStatusMeta(race);
  if (statusMeta.waiting && prevRace?.blastOffTimestamp.eq(0) && race.blastOffTimestamp.gt(0)) {
    notifyWhenRaceInProgress(race);
  }

  return statusMeta;
}

function calcStatusMeta(race: Race2Uranus.RaceStructOutput): IRaceStatusMeta {
  let waiting = false;
  let inProgress = false;
  let done = false;

  if (race?.finished) {
    done = true;
  } else {
    if (race?.started && race?.blastOffTimestamp.lt(new Date().getTime() / 1000)) {
      inProgress = true;
    } else {
      waiting = true;
    }
  }

  return {
    waiting,
    inProgress,
    done,
  };
}

async function notifyWhenRaceInProgress(race: Race2Uranus.RaceStructOutput) {
  const diffMillis = race.blastOffTimestamp.toNumber() * SECOND_MILLIS - Date.now();
  await sleep(diffMillis);

  updateRaceInStore(race.id, {}, { waiting: false, inProgress: true, done: false });
}

useRaceContractStore.subscribe(({ contract }) => {
  if (contract) {
    addEventListeners(contract as Race2Uranus);
  }
});

const processedEvents: { [key: string]: boolean } = {};

function addEventListeners(contract: Race2Uranus) {
  // ensureOneContractListener(contract, contract.filters.RaceCreated(), wrappedHandleRaceCreatedEvent);
  ensureOneContractListener(contract, contract.filters.RaceEntered(), wrappedHandleRaceEnteredEvent);
  ensureOneContractListener(contract, contract.filters.StakedOnRocket(), wrappedHandleStakedOnRocketEvent);
  ensureOneContractListener(contract, contract.filters.BoostApplied(), wrappedHandleBoostAppliedEvent);
  ensureOneContractListener(contract, contract.filters.RaceStarted(), wrappedHandleRaceStartedEvent);
  ensureOneContractListener(contract, contract.filters.RaceFinished(), wrappedHandleRaceFinishedEvent);
}

function ensureOneContractListener(contract: Race2Uranus, filter: any, handler: any) {
  contract.off(filter, handler);
  contract.on(filter, handler);
}

// const wrappedHandleRaceCreatedEvent = wrapEventHandler(handleRaceCreatedEvent);
// async function handleRaceCreatedEvent(ev: RaceCreatedEvent) {
//   const { args } = ev;
// }

const wrappedHandleRaceEnteredEvent = wrapEventHandler(handleRaceEnteredEvent);
async function handleRaceEnteredEvent(ev: RaceEnteredEvent) {
  const { args } = ev;
  const { raceId, rocketId, rocketeer, nft, nftId } = args;
  const race = getRaceStructFromStore(raceId);

  if (race) {
    const newRockets = [...(race.rockets || [])];

    newRockets.push({
      id: rocketId,
      nft,
      nftId,
      rocketeer,
      totalBoosts: 0,
      totalStake: ethers.BigNumber.from('0'),
      rocketeerRewardClaimed: false,
    } as any);

    updateRaceStructInStore(raceId, { rockets: newRockets });
  }
}

const wrappedHandleStakedOnRocketEvent = wrapEventHandler(handleStakedOnRocketEvent);
async function handleStakedOnRocketEvent(ev: StakedOnRocketEvent) {
  const { args } = ev;
  const { raceId, rocketId, amount } = args;
  const race = getRaceStructFromStore(raceId);

  if (race) {
    const updatedRockets = race.rockets?.map((r) => {
      let updatedRocket = r;
      if (updatedRocket.id === rocketId) {
        updatedRocket = {
          ...updatedRocket,
          totalStake: updatedRocket.totalStake.add(amount),
        };
      }

      return updatedRocket;
    });

    updateRaceStructInStore(raceId, { rockets: updatedRockets, rewardPool: race.rewardPool?.add(amount) });
  }
}

const wrappedHandleBoostAppliedEvent = wrapEventHandler(handleBoostAppliedEvent);
async function handleBoostAppliedEvent(ev: BoostAppliedEvent) {
  const { args } = ev;
  const { raceId, rocketId } = args;
  const race = getRaceStructFromStore(raceId);

  if (race) {
    const updatedRockets = race.rockets?.map((r) => {
      let updatedRocket = r;
      if (updatedRocket.id === rocketId) {
        updatedRocket = {
          ...updatedRocket,
          totalBoosts: updatedRocket.totalBoosts + 1,
        };
      }

      return updatedRocket;
    });

    updateRaceStructInStore(raceId, {
      rockets: updatedRockets,
      rewardPool: race.rewardPool?.add(race.configSnapshot?.boostPrice || '0'),
    });
  }
}

const wrappedHandleRaceStartedEvent = wrapEventHandler(handleRaceStartedEvent);
async function handleRaceStartedEvent(ev: RaceStartedEvent) {
  const { args } = ev;
  const { raceId, blastOffTimestamp, revealBlockNumber } = args;
  const race = getRaceStructFromStore(raceId);

  if (race) {
    updateRaceStructInStore(raceId, { started: true, blastOffTimestamp, revealBlock: revealBlockNumber });
  }
}

const wrappedHandleRaceFinishedEvent = wrapEventHandler(handleRaceFinishedEvent);
async function handleRaceFinishedEvent(ev: RaceFinishedEvent) {
  const { args } = ev;
  const { raceId, winningRocketId } = args;
  const race = getRaceStructFromStore(raceId);

  if (race) {
    updateRaceStructInStore(raceId, { finished: true, winner: winningRocketId });
  }
}

function wrapEventHandler(handler: (ev: any) => Promise<void>): TypedListener<any> {
  const wrappedHandler: TypedListener<any> = (...all) => {
    const ev = all[all.length - 1];
    const eventKey = `${ev.event}.${ev.transactionHash}`;

    if (!processedEvents[eventKey]) {
      processedEvents[eventKey] = true;
      q.push(async () => {
        await handler(ev);
      });
    }
  };
  return wrappedHandler;
}

function getRaceStructFromStore(raceId: BigNumberish): Race2Uranus.RaceStructOutput | undefined {
  return useRaceStore.getState()[raceId.toString()].race;
}

function getRaceFromStore(raceId: BigNumberish): IRace {
  return useRaceStore.getState()[raceId.toString()];
}

function updateRaceStructInStore(
  raceId: BigNumberish,
  raceStruct: Partial<Race2Uranus.RaceStructOutput>,
  statusMeta?: IRaceStatusMeta
) {
  updateRaceInStore(raceId, { race: raceStruct, statusMeta } as any);
}

function updateRaceInStore(raceId: BigNumberish, race: Partial<IRace>, meta?: IRaceStatusMeta) {
  const existingRace = getRaceFromStore(raceId) || {};
  const newRace = merge({}, existingRace, race);
  const statusMeta = meta || calcAndNotifyStatusMeta(newRace.race!, existingRace.race);
  useRaceStore.setState({ [raceId.toString()]: merge(newRace, { statusMeta }) });
}
