import { Contract } from 'ethers';
import create from 'zustand';

import Race2UranusABI from '../abi/Race2Uranus.json';
import { GAME_ADDRESS } from '../env';
import { Race2Uranus } from '../types';
import { useEthersProvider, useEthersProviderStore } from './useEthersProvider';
import { useEthersSigner, useEthersSignerStore } from './useEthersSigner';

interface IRaceContractStoreState {
  contract?: Race2Uranus;
}

interface IRaceContractStoreMethods {}

interface IRaceContractHook extends IRaceContractStoreState, IRaceContractStoreMethods {}

const defaultState: IRaceContractStoreState = {};

export const useRaceContractStore = create<IRaceContractStoreState>(() => defaultState);

export function useRaceContract(): IRaceContractHook {
  useEthersProvider();
  useEthersSigner();
  const storeState = useRaceContractStore();

  return storeState;
}

useEthersProviderStore.subscribe(() => {
  updateContract();
});
useEthersSignerStore.subscribe(() => {
  updateContract();
});

async function updateContract() {
  const { provider } = useEthersProviderStore.getState();
  const { signer } = useEthersSignerStore.getState();

  if (provider || signer) {
    const { contract: prevContract } = useRaceContractStore.getState();
    if (prevContract?.removeAllListeners!) {
      prevContract.removeAllListeners();
    }

    const contract: any = new Contract(GAME_ADDRESS, Race2UranusABI, signer || provider);
    useRaceContractStore.setState({ contract });
  }
}
