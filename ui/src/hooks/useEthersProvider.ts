import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import create from 'zustand';
import debounce from 'lodash/debounce';
import { useReadonlyNetwork } from '@usedapp/core/dist/esm/src/hooks';

import { CHAIN_ID } from '../env';

interface IEthersProviderStoreState {
  provider?: ethers.providers.JsonRpcProvider;
}

interface IEthersProviderStoreMethods {}

interface IEthersProviderHook extends IEthersProviderStoreState, IEthersProviderStoreMethods {}

const defaultState: IEthersProviderStoreState = {} as any;

export const useEthersProviderStore = create<IEthersProviderStoreState>(() => defaultState);

export function useEthersProvider(): IEthersProviderHook {
  const { library } = useEthers();
  const { provider } = useReadonlyNetwork({ chainId: CHAIN_ID }) || ({} as any);
  const storeState = useEthersProviderStore();

  useEffect(() => {
    if (library?._network?.chainId === CHAIN_ID) {
      updateProviderDebounce(library);
    } else {
      updateProviderDebounce(provider);
    }
  }, [library, provider]);

  return storeState;
}

const updateProviderDebounce = debounce((provider?: ethers.providers.JsonRpcProvider) => {
  useEthersProviderStore.setState({ provider });
}, 300);
