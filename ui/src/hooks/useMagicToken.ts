import { Contract } from 'ethers';
import { useEffect } from 'react';
import create from 'zustand';

import ERC20ABI from '../abi/ERC20.json';
import { MAGIC_ADDRESS } from '../env';
import { SimpleToken } from '../types';
import { useEthersSigner } from './useEthersSigner';

interface IMagicTokenStoreState {
  contract: Partial<SimpleToken>;
}

interface IMagicTokenStoreMethods {}

interface IMagicTokenHook extends IMagicTokenStoreState, IMagicTokenStoreMethods {}

const defaultState: IMagicTokenStoreState = { contract: {} } as any;

export const useMagicTokenStore = create<IMagicTokenStoreState>(() => defaultState);

export function useMagicToken(): IMagicTokenHook {
  const { signer } = useEthersSigner();
  const storeState = useMagicTokenStore();

  useEffect(() => {
    const { contract: prevContract } = useMagicTokenStore.getState();
    if (prevContract?.removeAllListeners!) {
      prevContract.removeAllListeners();
    }

    const contract: any = new Contract(MAGIC_ADDRESS, ERC20ABI, signer);
    useMagicTokenStore.setState({ contract });
  }, [signer]);

  return storeState;
}
