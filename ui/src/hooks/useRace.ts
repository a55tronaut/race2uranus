import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useEffect } from 'react';
import create from 'zustand';
import queue from 'queue';
import { deepmergeCustom } from 'deepmerge-ts';
import deepEqual from 'deep-equal';
import moment from 'moment';

import {
  BoostAppliedEvent,
  IRaceStatusMeta,
  Race2Uranus,
  RaceEnteredEvent,
  RaceFinishedEvent,
  RaceStartedEvent,
  StakedOnRocketEvent,
  TypedListener,
} from '../types';
import { useRaceContract, useRaceContractStore } from './useRaceContract';
import { useWaitUntilL1Block } from './useWaitUntilL1Block';
import { useL1Block, useL1BlockStore } from './useL1Block';
import { useWaitUntil } from './useWaitUntil';

interface IRaceStoreState {
  [key: string]: IRace;
}

interface IRace {
  loading: boolean;
  error: boolean;
  race?: Race2Uranus.RaceStructOutput;
  statusMeta?: IRaceStatusMeta;
}

// to handle merging contract structOutputs (arrays with props)
const customMerge = deepmergeCustom({
  mergeOthers(records, utils) {
    if (records.some((r) => Array.isArray(r))) {
      const res: any = [];
      records.forEach((r: any) => {
        Object.keys(r).forEach((key) => {
          res[key] = r[key];
        });
      });

      return res;
    }

    return utils.defaultMergeFunctions.mergeOthers(records);
  },
});

const q = queue({ autostart: true, concurrency: 1 });

const defaultState: IRaceStoreState = {};
const defaultRace: IRace = { loading: true, error: false };

const useRaceStore = create<IRaceStoreState>(() => defaultState);

export function useRace(id: BigNumberish): IRace {
  useL1Block(); // ensure hook is called (we use its store below)
  const { contract } = useRaceContract();
  const race = useRaceStore((state) => state[id?.toString()]) || defaultRace;
  const revealBlockReached = useWaitUntilL1Block(race.race?.revealBlock!);
  const blastOffReached = useWaitUntil(race.race?.blastOffTimestamp.toNumber()! * 1000);

  useEffect(() => {
    const shouldLoadRace = id && !getRaceFromStore(id) && !!contract.functions?.getRace;
    if (shouldLoadRace) {
      updateRaceInStore(id, defaultRace);
      refreshRaceData();
    }
    async function refreshRaceData() {
      try {
        const [race] = await contract.functions!.getRace(id)!;
        updateRaceInStore(id, { loading: false, race });
      } catch (e) {
        console.error(e);
        updateRaceInStore(id, { loading: false, error: true });
      }
    }
  }, [contract.functions, id, race]);

  useEffect(() => {
    if (blastOffReached) {
      updateStatusMetaInStore(id, calcStatusMeta(race.race!));
    }
  }, [blastOffReached, id, race.race]);

  useEffect(() => {
    if (revealBlockReached) {
      updateStatusMetaInStore(id, calcStatusMeta(race.race!));
    }
  }, [blastOffReached, id, race.race, revealBlockReached]);

  return race;
}

function calcStatusMeta(race: Race2Uranus.RaceStructOutput): IRaceStatusMeta {
  let waiting = false;
  let inProgress = false;
  let done = false;
  let revealBlockReached = false;

  if (race?.finished) {
    done = true;
  } else {
    if (race?.started && race?.blastOffTimestamp.lt(Math.ceil(Date.now() / 1000))) {
      inProgress = true;
    } else {
      waiting = true;
    }
  }

  const { currentBlock } = useL1BlockStore.getState();
  if (currentBlock > 0 && race?.revealBlock.gt(0) && race?.revealBlock.lte(currentBlock)) {
    revealBlockReached = true;
  }

  return {
    waiting,
    inProgress,
    done,
    revealBlockReached,
  };
}

useRaceContractStore.subscribe(({ contract }) => {
  if (contract) {
    addEventListeners(contract as Race2Uranus);
  }
});

const processedEvents: { [key: string]: boolean } = {};

function addEventListeners(contract: Race2Uranus) {
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

function updateRaceStructInStore(raceId: BigNumberish, raceStruct: Partial<Race2Uranus.RaceStructOutput>) {
  updateRaceInStore(raceId, { race: raceStruct } as any);
}

function updateRaceInStore(raceId: BigNumberish, race: Partial<IRace>) {
  const existingRace = getRaceFromStore(raceId) || {};
  const newRace = customMerge(existingRace, race);

  if (deepEqual(existingRace, newRace)) {
    return;
  }
  const statusMeta = calcStatusMeta(newRace.race!);
  const newRaceWithMeta = customMerge(newRace, { statusMeta });
  useRaceStore.setState({ [raceId.toString()]: newRaceWithMeta as any });
}

function updateStatusMetaInStore(raceId: BigNumberish, statusMeta: Partial<IRaceStatusMeta>) {
  const existingRace = getRaceFromStore(raceId) || {};
  const newStatusMeta = customMerge(existingRace.statusMeta || {}, statusMeta);
  if (deepEqual(existingRace.statusMeta, newStatusMeta)) {
    return;
  }
  const newRaceWithMeta = customMerge(existingRace, { statusMeta: newStatusMeta });
  useRaceStore.setState({ [raceId.toString()]: newRaceWithMeta as any });
}
