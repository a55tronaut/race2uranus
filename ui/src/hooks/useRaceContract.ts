import { Contract } from 'ethers';
import { useEffect } from 'react';
import create from 'zustand';

import Race2UranusABI from '../abi/Race2Uranus.json';
import { GAME_ADDRESS } from '../env';
import { Race2Uranus } from '../types';
import { useEthersProvider } from './useEthersProvider';
import { useEthersSigner } from './useEthersSigner';

interface IRaceContractStoreState {
  contract: Partial<Race2Uranus>;
}

interface IRaceContractStoreMethods {}

interface IRaceContractHook extends IRaceContractStoreState, IRaceContractStoreMethods {}

const defaultState: IRaceContractStoreState = { contract: {} } as any;

export const useRaceContractStore = create<IRaceContractStoreState>(() => defaultState);

export function useRaceContract(): IRaceContractHook {
  const { provider } = useEthersProvider();
  const { signer } = useEthersSigner();
  const storeState = useRaceContractStore();

  useEffect(() => {
    if (provider || signer) {
      const { contract: prevContract } = useRaceContractStore.getState();
      if (prevContract?.removeAllListeners!) {
        prevContract.removeAllListeners();
      }

      const contract: any = new Contract(GAME_ADDRESS, Race2UranusABI, signer || provider);
      useRaceContractStore.setState({ contract });
    }
  }, [provider, signer]);

  return storeState;
}
