import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import create from 'zustand';
import debounce from 'lodash/debounce';

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
    updateProviderDebounce(library);
  }, [library]);

  return storeState;
}

const updateProviderDebounce = debounce((provider?: ethers.providers.JsonRpcProvider) => {
  useEthersProviderStore.setState({ provider });
}, 300);
