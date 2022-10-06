import create from 'zustand';
import debounce from 'lodash/debounce';

import { Race2Uranus } from '../types';
import { useRaceContractStore } from './useRaceContract';

interface IRaceConfigStoreState {
  config?: Race2Uranus.RaceConfigStructOutput;
}

interface IRaceConfigStoreMethods {}

interface IRaceConfigHook extends IRaceConfigStoreState, IRaceConfigStoreMethods {}

const defaultState: IRaceConfigStoreState = {} as any;

export const useRaceConfigStore = create<IRaceConfigStoreState>(() => defaultState);

export function useRaceConfig(): IRaceConfigHook {
  const state = useRaceConfigStore();
  return state;
}

useRaceContractStore.subscribe(({ contract }) => {
  if (contract) {
    updateTimeParamsDebounced(contract);
  }
});

const updateTimeParamsDebounced = debounce(async (contract: Race2Uranus) => {
  const [config] = await contract.functions.getRaceConfig();
  useRaceConfigStore.setState({ config });
}, 300);
