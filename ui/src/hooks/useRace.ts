import { BigNumberish } from 'ethers';
import { useCallback, useEffect } from 'react';
import create from 'zustand';

import { IRaceStatusMeta, Race2Uranus } from '../types';
import { SECOND_MILLIS } from '../constants';
import { useRaceContract, useRaceContractStore } from './useRaceContract';
import { useWaitUntilL1Block } from './useWaitUntilL1Block';
import { useL1Block, useL1BlockStore } from './useL1Block';
import { useWaitUntil } from './useWaitUntil';
import { useEthersProviderStore } from './useEthersProvider';

interface IRaceStoreState {
  [key: string]: IRace;
}

interface IRace {
  loading: boolean;
  error: boolean;
  race?: Race2Uranus.RaceStructOutput;
  statusMeta?: IRaceStatusMeta;
}

const jsonDeepEqual = (a: any, b: any): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

const defaultState: IRaceStoreState = {};
const defaultRace: IRace = { loading: true, error: false };

interface IRaceMethods {
  refresh: () => Promise<void>;
}

interface IRaceHook extends IRace, IRaceMethods {}

const useRaceStore = create<IRaceStoreState>(() => defaultState);

export function useRace(id?: BigNumberish): IRaceHook {
  useL1Block(); // ensure hook is called so its state and store is properly initialized (we use the store below)
  const { contract } = useRaceContract();
  const race = useRaceStore((state) => state[id?.toString()!]) || defaultRace;
  const revealBlockReached = useWaitUntilL1Block(race.race?.revealBlock!);
  const blastOffReached = useWaitUntil(race.race?.blastOffTimestamp.toNumber()! * 1000);

  const refresh = useCallback(async () => {
    try {
      const [race] = await contract!.functions.getRace(id!)!;
      updateRaceInStore(id!, { loading: false, race });
    } catch (e) {
      console.error(e);
      updateRaceInStore(id!, { loading: false, error: true });
    }
  }, [contract, id]);

  useEffect(() => {
    const shouldLoadRace = id && !getRaceFromStore(id) && !!contract;
    if (shouldLoadRace) {
      updateRaceInStore(id, defaultRace);
      refresh();
    }
  }, [contract, id, race, refresh]);

  useEffect(() => {
    if (blastOffReached) {
      updateStatusMetaInStore(id!, calcStatusMeta(race.race!));
    }
  }, [blastOffReached, id, race.race]);

  useEffect(() => {
    if (revealBlockReached) {
      updateStatusMetaInStore(id!, calcStatusMeta(race.race!));
    }
  }, [blastOffReached, id, race.race, revealBlockReached]);

  return {
    ...race,
    refresh,
  };
}

function calcStatusMeta(race: Race2Uranus.RaceStructOutput): IRaceStatusMeta | undefined {
  if (!race) {
    return;
  }

  let waiting = false;
  let rosterFull = false;
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

  rosterFull = race && race?.rockets.length === race?.configSnapshot.maxRockets;

  const { currentBlock } = useL1BlockStore.getState();
  if (currentBlock > 0 && race?.revealBlock.gt(0) && race?.revealBlock.lte(currentBlock)) {
    revealBlockReached = true;
  }

  return {
    waiting,
    rosterFull,
    inProgress,
    done,
    revealBlockReached,
  };
}

updateRacesPeriodically();

function updateRacesPeriodically() {
  setInterval(updateRaces, 30 * SECOND_MILLIS);
}

async function updateRaces() {
  const state = useRaceStore.getState();
  let updated = false;
  const raceIds = Object.keys(state);
  for (const raceId of raceIds) {
    const changed = await updateRace(raceId);
    if (changed) {
      updated = true;
    }
  }
  return updated;
}

async function updateRace(id: BigNumberish) {
  const { contract } = useRaceContractStore.getState();
  if (contract) {
    const [race] = await contract!.functions.getRace(id!)!;
    return updateRaceInStore(id!, { loading: false, race });
  }

  return false;
}

useRaceContractStore.subscribe(({ contract }) => {
  if (contract) {
    addEventListeners(contract as Race2Uranus);
  }
});

function addEventListeners(contract: Race2Uranus) {
  ensureOneContractListener(contract, contract.filters.RaceEntered(), updateNextBlock);
  ensureOneContractListener(contract, contract.filters.StakedOnRocket(), updateNextBlock);
  ensureOneContractListener(contract, contract.filters.BoostApplied(), updateNextBlock);
  ensureOneContractListener(contract, contract.filters.RaceStarted(), updateNextBlock);
  ensureOneContractListener(contract, contract.filters.RaceFinished(), updateNextBlock);
}

function ensureOneContractListener(contract: Race2Uranus, filter: any, handler: any) {
  contract.off(filter, handler);
  contract.on(filter, handler);
}

function updateNextBlock() {
  const { provider } = useEthersProviderStore.getState();
  provider?.once('block', updateRaces);
}

function getRaceFromStore(raceId: BigNumberish): IRace {
  return useRaceStore.getState()[raceId?.toString()];
}

function updateRaceInStore(raceId: BigNumberish, race: Partial<IRace>) {
  const existingRace = getRaceFromStore(raceId) || {};
  const newRace = { ...existingRace, ...race };

  if (jsonDeepEqual(existingRace, newRace)) {
    return;
  }
  const statusMeta = calcStatusMeta(newRace.race!);
  const newRaceWithMeta = {
    ...newRace,
    statusMeta,
  };
  useRaceStore.setState({ [raceId.toString()]: newRaceWithMeta as any });

  const changed = true;

  return changed;
}

function updateStatusMetaInStore(raceId: BigNumberish, statusMeta?: Partial<IRaceStatusMeta>) {
  const existingRace = getRaceFromStore(raceId) || {};
  const newStatusMeta = { ...existingRace.statusMeta, ...statusMeta };
  if (jsonDeepEqual(existingRace.statusMeta, newStatusMeta)) {
    return;
  }
  const newRaceWithMeta = {
    ...existingRace,
    statusMeta,
  };
  useRaceStore.setState({ [raceId.toString()]: newRaceWithMeta as any });

  const changed = true;

  return changed;
}
