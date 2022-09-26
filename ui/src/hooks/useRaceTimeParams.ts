import create from 'zustand';
import debounce from 'lodash/debounce';

import { Race2Uranus } from '../types';
import { useRaceContractStore } from './useRaceContract';

interface IRaceTimeParamsStoreState {
  params?: Race2Uranus.TimeParamsStructOutput;
}

interface IRaceTimeParamsStoreMethods {}

interface IRaceTimeParamsHook extends IRaceTimeParamsStoreState, IRaceTimeParamsStoreMethods {}

const defaultState: IRaceTimeParamsStoreState = {} as any;

export const useRaceTimeParamsStore = create<IRaceTimeParamsStoreState>(() => defaultState);

export function useRaceTimeParams(): IRaceTimeParamsHook {
  const state = useRaceTimeParamsStore();
  return state;
}

useRaceContractStore.subscribe(({ contract }) => {
  if (contract) {
    updateTimeParamsDebounced(contract);
  }
});

const updateTimeParamsDebounced = debounce(async (contract: Race2Uranus) => {
  const [params] = await contract.functions.getTimeParams();
  useRaceTimeParamsStore.setState({ params });
}, 300);
