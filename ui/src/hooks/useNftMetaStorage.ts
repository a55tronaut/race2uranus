import { BigNumberish } from 'ethers';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface INftMetaStorageState {
  metas: { [key: string]: INftMeta };
}

export interface INftMeta {
  url: string;
  name: string;
}

interface INftMetaStorageMethods {
  addMeta: (address: string, id: BigNumberish, meta: INftMeta) => void;
  getMeta: (address: string, id: BigNumberish) => INftMeta | undefined;
}

interface INftMetaStorageHook extends INftMetaStorageState, INftMetaStorageMethods {}

const defaultState: INftMetaStorageState = { metas: {} };

export const useNftMetaStorageStore = create<INftMetaStorageState>(
  persist(() => defaultState, {
    name: 'nftMetas',
    getStorage: () => localStorage,
  }) as any
);

export function addMeta(address: string, id: BigNumberish, meta: INftMeta) {
  const { metas } = useNftMetaStorageStore.getState();
  const key = getStorageKey(address, id);
  useNftMetaStorageStore.setState({ metas: { ...metas, [key]: meta } });
}

export function getMeta(address: string, id: BigNumberish): INftMeta {
  const { metas } = useNftMetaStorageStore.getState();
  const key = getStorageKey(address, id);
  return metas[key];
}

export function getStorageKey(address: string, id: BigNumberish) {
  const normalizedAddress = address.toLowerCase();
  return `${normalizedAddress}.${id.toString()}`;
}

export const useNftMetaStorage = (): INftMetaStorageHook => {
  const state = useNftMetaStorageStore();

  return {
    ...state,
    addMeta,
    getMeta,
  };
};
