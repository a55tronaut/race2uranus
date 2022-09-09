import { BigNumberish, ethers } from 'ethers';
import { useCallback, useEffect } from 'react';
import create from 'zustand';
import queue from 'queue';

import {
  BoostAppliedEvent,
  Race2Uranus,
  RaceCreatedEvent,
  RaceEnteredEvent,
  RaceFinishedEvent,
  RaceStartedEvent,
  StakedOnRocketEvent,
  TypedListener,
} from '../types';
import { useRaceContract, useRaceContractStore } from './useRaceContract';

interface IRaceStoreState {
  [key: string]: IRaceItem;
}

interface IRaceItem extends Partial<Race2Uranus.RaceStructOutput> {
  functions?: Race2Uranus['functions'];
}

// this ensures race data for a given id is only loaded once
// relying on zustand to keep track of this does not work because setState is async
// so if this hook is used in more than one place then before zustand updates the data refresh may be triggered multiple times
const knownRaces: { [key: string]: boolean } = {};

const q = queue({ autostart: true, concurrency: 1 });

const defaultState: IRaceStoreState = {};

const useRaceStore = create<IRaceStoreState>(() => defaultState);

export function useRace(id: BigNumberish): IRaceItem {
  const { contract } = useRaceContract();
  const race = useRaceStore((state) => state[id?.toString()]);

  useEffect(() => {
    const shouldLoadRace = id && !knownRaces[id.toString()] && contract.functions?.getRace;
    if (shouldLoadRace) {
      knownRaces[id.toString()] = true;
      refreshRaceData();
    }
    async function refreshRaceData() {
      const [race] = await contract.functions?.getRace(id)!;
      updateRaceStore(id, race);
    }
  }, [contract.functions, id, race]);

  return {
    ...race,
    functions: contract.functions!,
  };
}

useRaceContractStore.subscribe(({ contract }) => {
  if (contract) {
    addEventListeners(contract as Race2Uranus);
  }
});

const processedEvents: { [key: string]: boolean } = {};

function addEventListeners(contract: Race2Uranus) {
  ensureOneContractListener(contract, contract.filters.RaceCreated(), wrappedHandleRaceCreatedEvent);
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

const wrappedHandleRaceCreatedEvent = wrapEventHandler(handleRaceCreatedEvent);
async function handleRaceCreatedEvent(ev: RaceCreatedEvent) {
  const { args } = ev;
}

const wrappedHandleRaceEnteredEvent = wrapEventHandler(handleRaceEnteredEvent);
async function handleRaceEnteredEvent(ev: RaceEnteredEvent) {
  const { args } = ev;
  const { raceId, rocketId, rocketeer, nft, nftId } = args;
  const race = getRaceFromStore(raceId);

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

    updateRaceStore(raceId, { rockets: newRockets });
  }
}

const wrappedHandleStakedOnRocketEvent = wrapEventHandler(handleStakedOnRocketEvent);
async function handleStakedOnRocketEvent(ev: StakedOnRocketEvent) {
  const { args } = ev;
  const { raceId, rocketId, amount } = args;
  const race = getRaceFromStore(raceId);

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

    updateRaceStore(raceId, { rockets: updatedRockets, rewardPool: race.rewardPool?.add(amount) });
  }
}

const wrappedHandleBoostAppliedEvent = wrapEventHandler(handleBoostAppliedEvent);
async function handleBoostAppliedEvent(ev: BoostAppliedEvent) {
  const { args } = ev;
  const { raceId, rocketId } = args;
  const race = getRaceFromStore(raceId);

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

    updateRaceStore(raceId, {
      rockets: updatedRockets,
      rewardPool: race.rewardPool?.add(race.configSnapshot?.boostPrice || '0'),
    });
  }
}

const wrappedHandleRaceStartedEvent = wrapEventHandler(handleRaceStartedEvent);
async function handleRaceStartedEvent(ev: RaceStartedEvent) {
  const { args } = ev;
  const { raceId, revealBlockNumber } = args;
  const race = getRaceFromStore(raceId);

  if (race) {
    updateRaceStore(raceId, { started: true, revealBlock: revealBlockNumber });
  }
}

const wrappedHandleRaceFinishedEvent = wrapEventHandler(handleRaceFinishedEvent);
async function handleRaceFinishedEvent(ev: RaceFinishedEvent) {
  const { args } = ev;
  const { raceId, winningRocketId } = args;
  const race = getRaceFromStore(raceId);

  if (race) {
    updateRaceStore(raceId, { finished: true, winner: winningRocketId });
  }
}

function wrapEventHandler(handler: (ev: any) => Promise<void>): TypedListener<any> {
  const wrappedHandler: TypedListener<any> = (...all) => {
    const ev = all[all.length - 1];
    const eventKey = `${ev.event}${ev.transactionHash}`;
    console.log('found event', eventKey, ev.transactionHash);
    if (!processedEvents[eventKey]) {
      processedEvents[eventKey] = true;
      q.push(async () => {
        await handler(ev);
      });
    }
  };
  return wrappedHandler;
}

function getRaceFromStore(raceId: BigNumberish): IRaceItem {
  return useRaceStore.getState()[raceId.toString()];
}

function updateRaceStore(raceId: BigNumberish, race: Partial<IRaceItem>) {
  useRaceStore.setState({ [raceId.toString()]: race });
}
