import create from 'zustand';

interface IEnterRaceModalStoreState {
  show: boolean;
}

interface IEnterRaceModalStoreMethods {
  open: () => void;
  close: () => void;
}

interface IEnterRaceModalHook extends IEnterRaceModalStoreState, IEnterRaceModalStoreMethods {}

const defaultState: IEnterRaceModalStoreState = { show: false };

export const useEnterRaceModalStore = create<IEnterRaceModalStoreState>(() => defaultState);

export function useEnterRaceModal(): IEnterRaceModalHook {
  const { show } = useEnterRaceModalStore();

  return { show, open, close };
}

function open() {
  useEnterRaceModalStore.setState({ show: true });
}

function close() {
  useEnterRaceModalStore.setState({ show: false });
}
