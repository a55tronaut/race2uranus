import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import create from 'zustand';

interface IEthersProviderStoreState {
  provider?: ethers.providers.JsonRpcProvider;
}

interface IEthersProviderStoreMethods {}

interface IEthersProviderHook extends IEthersProviderStoreState, IEthersProviderStoreMethods {}

const defaultState: IEthersProviderStoreState = {} as any;

export const useEthersProviderStore = create<IEthersProviderStoreState>(() => defaultState);

export function useEthersProvider(): IEthersProviderHook {
  const { library } = useEthers();
  const storeState = useEthersProviderStore();

  useEffect(() => {
    useEthersProviderStore.setState({ provider: library });
  }, [library]);

  return storeState;
}
