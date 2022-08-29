import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import create from 'zustand';

import { useEthersProvider } from './useEthersProvider';

interface IEthersSignerStoreState {
  signer?: ethers.providers.JsonRpcSigner;
}

interface IEthersSignerStoreMethods {}

interface IEthersSignerHook extends IEthersSignerStoreState, IEthersSignerStoreMethods {}

const defaultState: IEthersSignerStoreState = {} as any;

export const useEthersSignerStore = create<IEthersSignerStoreState>(() => defaultState);

export function useEthersSigner(): IEthersSignerHook {
  const { account } = useEthers();
  const { provider } = useEthersProvider();
  const storeState = useEthersSignerStore();

  useEffect(() => {
    const signer = provider?.getSigner(account);
    useEthersSignerStore.setState({ signer });
  }, [account, provider]);

  return storeState;
}
