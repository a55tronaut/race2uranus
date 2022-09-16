import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import create from 'zustand';
import debounce from 'lodash/debounce';

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
    const newSigner = !!signer?._address ? signer : undefined;
    const { signer: prevSigner } = useEthersSignerStore.getState();
    if (newSigner !== prevSigner) {
      updateSignerDebounce(newSigner);
    }
  }, [account, provider]);

  return storeState;
}

const updateSignerDebounce = debounce((signer?: ethers.providers.JsonRpcSigner) => {
  useEthersSignerStore.setState({ signer });
}, 300);
