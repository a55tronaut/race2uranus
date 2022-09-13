import { useReadonlyNetwork } from '@usedapp/core/dist/esm/src/hooks';
import { JsonRpcProvider } from '@ethersproject/providers';
import { useEffect } from 'react';
import create from 'zustand';

import { L1_CHAIN_ID } from '../env';

interface IL1StoreState {
  provider?: JsonRpcProvider;
}

interface IL1StoreMethods {}

interface IRaceContractHook extends IL1StoreState, IL1StoreMethods {}

const defaultState: IL1StoreState = {};

export const useL1Store = create<IL1StoreState>(() => defaultState);

export function useL1(): IRaceContractHook {
  const { provider } = useReadonlyNetwork({ chainId: L1_CHAIN_ID }) || ({} as any);
  const storeState = useL1Store();

  useEffect(() => {
    if (provider && provider !== useL1Store.getState().provider) {
      useL1Store.setState({ provider });
    }
  }, [provider]);

  return storeState;
}
