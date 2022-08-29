import { BigNumberish, ethers } from 'ethers';
import { useEffect } from 'react';
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

interface IRaceStoreState extends Partial<Race2Uranus.RaceStructOutput> {
  functions: Race2Uranus['functions'];
}

interface IRaceStoreMethods {}

interface IRaceHook extends IRaceStoreState, IRaceStoreMethods {}

const q = queue({ autostart: true, concurrency: 1 });

const defaultState: IRaceStoreState = {} as any;

const useRaceStore = create<IRaceStoreState>(() => defaultState);

export function useRace(id: BigNumberish): IRaceHook {
  const { contract } = useRaceContract();
  const raceState = useRaceStore();

  useEffect(() => {
    if (id && contract.functions?.getRace!) {
      refreshRaceAttrs();
    }
    async function refreshRaceAttrs() {
      const [race] = await contract.functions?.getRace(id)!;
      useRaceStore.setState(race);
    }
  }, [contract.functions, id]);

  return {
    ...raceState,
    functions: contract.functions!,
  };
}

useRaceStore.subscribe(({ id }) => {
  if (id) {
    const { contract } = useRaceContractStore.getState();
    addEventListeners(id, contract as Race2Uranus);
    watchEvents();
  }
});

function watchEvents() {
  useRaceContractStore.subscribe(({ contract }) => {
    const { id } = useRaceStore.getState();

    if (id != null && contract) {
      addEventListeners(id, contract as Race2Uranus);
    }
  });
}

const processedEvents: { [key: string]: boolean } = {};

function addEventListeners(id: BigNumberish, contract: Race2Uranus) {
  ensureOneContractListener(contract, contract.filters.RaceCreated(id), wrappedHandleRaceCreatedEvent);
  ensureOneContractListener(contract, contract.filters.RaceEntered(id), wrappedHandleRaceEnteredEvent);
  ensureOneContractListener(contract, contract.filters.StakedOnRocket(id), wrappedHandleStakedOnRocketEvent);
  ensureOneContractListener(contract, contract.filters.BoostApplied(id), wrappedHandleBoostAppliedEvent);
  ensureOneContractListener(contract, contract.filters.RaceStarted(id), wrappedHandleRaceStartedEvent);
  ensureOneContractListener(contract, contract.filters.RaceFinished(id), wrappedHandleRaceFinishedEvent);
}

function ensureOneContractListener(contract: Race2Uranus, filter: any, handler: any) {
  contract.off(filter, handler);
  contract.on(filter, handler);
}

function wrapEventHandler(handler: (ev: any) => Promise<void>): TypedListener<any> {
  const wrappedHandler: TypedListener<any> = (...all) => {
    const ev = all[all.length - 1];
    const eventKey = `${ev.event}${ev.transactionHash}`;
    if (!processedEvents[eventKey]) {
      processedEvents[eventKey] = true;
      q.push(async () => {
        await handler(ev);
      });
    }
  };
  return wrappedHandler;
}

const wrappedHandleRaceCreatedEvent = wrapEventHandler(handleRaceCreatedEvent);
async function handleRaceCreatedEvent(ev: RaceCreatedEvent) {
  const { args } = ev;
  console.log(args);
}

const wrappedHandleRaceEnteredEvent = wrapEventHandler(handleRaceEnteredEvent);
async function handleRaceEnteredEvent(ev: RaceEnteredEvent) {
  const { args } = ev;
  const { rocketId, rocketeer, nft, nftId } = args;
  const { rockets } = useRaceStore.getState();
  const newRockets = [...(rockets || [])];

  newRockets.push({
    id: rocketId,
    nft,
    nftId,
    rocketeer,
    totalBoosts: 0,
    totalStake: ethers.BigNumber.from('0'),
    rocketeerRewardClaimed: false,
  } as any);

  useRaceStore.setState({ rockets });
}

const wrappedHandleStakedOnRocketEvent = wrapEventHandler(handleStakedOnRocketEvent);
async function handleStakedOnRocketEvent(ev: StakedOnRocketEvent) {
  const { args } = ev;
  const { rocketId, amount } = args;
  const { rewardPool, rockets } = useRaceStore.getState();

  const updatedRockets = rockets?.map((r) => {
    let updatedRocket = r;
    if (updatedRocket.id === rocketId) {
      updatedRocket = {
        ...updatedRocket,
        totalStake: updatedRocket.totalStake.add(amount),
      };
    }

    return updatedRocket;
  });

  useRaceStore.setState({ rockets: updatedRockets, rewardPool: rewardPool?.add(amount) });
}

const wrappedHandleBoostAppliedEvent = wrapEventHandler(handleBoostAppliedEvent);
async function handleBoostAppliedEvent(ev: BoostAppliedEvent) {
  const { args } = ev;
  const { rocketId } = args;
  const { rockets, configSnapshot, rewardPool } = useRaceStore.getState();

  const updatedRockets = rockets?.map((r) => {
    let updatedRocket = r;
    if (updatedRocket.id === rocketId) {
      updatedRocket = {
        ...updatedRocket,
        totalBoosts: updatedRocket.totalBoosts + 1,
      };
    }

    return updatedRocket;
  });

  useRaceStore.setState({ rockets: updatedRockets, rewardPool: rewardPool?.add(configSnapshot?.boostPrice || '0') });
}

const wrappedHandleRaceStartedEvent = wrapEventHandler(handleRaceStartedEvent);
async function handleRaceStartedEvent(ev: RaceStartedEvent) {
  const { args } = ev;
  const { revealBlockNumber } = args;

  useRaceStore.setState({ started: true, revealBlock: revealBlockNumber });
}

const wrappedHandleRaceFinishedEvent = wrapEventHandler(handleRaceFinishedEvent);
async function handleRaceFinishedEvent(ev: RaceFinishedEvent) {
  const { args } = ev;
  const { winningRocketId } = args;

  useRaceStore.setState({ finished: true, winner: winningRocketId });
}
