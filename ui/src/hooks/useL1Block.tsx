import { JsonRpcProvider } from '@ethersproject/providers';
import { isEmpty } from 'lodash';
import create from 'zustand';

import { SECOND_MILLIS } from '../constants';
import { Race2Uranus } from '../types';
import { useL1, useL1Store } from './useL1';
import { useRaceContractStore } from './useRaceContract';

interface IL1BlockStoreState {
  loading: boolean;
  currentBlock: number;
  avgBlockTimeMillis: number;
  provider: JsonRpcProvider;
  contract: Race2Uranus;
}

interface IL1BlockStoreMethods {}

interface IL1BlockHook extends IL1BlockStoreState, IL1BlockStoreMethods {}

const defaultState: IL1BlockStoreState = { loading: true } as any;

export const useL1BlockStore = create<IL1BlockStoreState>(() => defaultState);

export function useL1Block(): IL1BlockHook {
  useL1();
  const storeState = useL1BlockStore();
  return storeState;
}

useL1Store.subscribe(({ provider }) => {
  if (provider) {
    useL1BlockStore.setState({ provider });
  }
});

useRaceContractStore.subscribe(({ contract }) => {
  if (contract) {
    useL1BlockStore.setState({ contract } as any);
  }
});

useL1BlockStore.subscribe(({ provider, contract }, prevState) => {
  if (provider && !isEmpty(contract) && (provider !== prevState.provider || contract !== prevState.contract)) {
    updateBlocksPeriodically();
  }
});

let intervalId: NodeJS.Timer;

async function updateBlocksPeriodically() {
  clearInterval(intervalId);
  updateBlocks();
  intervalId = setInterval(updateBlocks, 10 * SECOND_MILLIS);
}

async function updateBlocks() {
  const numBlocks = 10000;
  const { provider, contract } = useL1BlockStore.getState();

  const [currentBlockBn] = await contract.functions.getBlockNumber();
  // sometimes RPCs are out of sync
  // get latest block -1 to try to mitigate this
  const currentBlock = currentBlockBn.toNumber() - 1;
  const now = Date.now();
  const oldBlock = await provider.getBlock(currentBlock - numBlocks);
  const timeDiff = now - oldBlock.timestamp * SECOND_MILLIS;
  const avgBlockTimeMillis = timeDiff / numBlocks;

  useL1BlockStore.setState({ loading: false, currentBlock: currentBlock, avgBlockTimeMillis });
}
