import { BigNumberish } from 'ethers';
import create from 'zustand';
import { persist } from 'zustand/middleware';

import { bigNumberishToString } from '../utils';

interface INftImageUrlStorageState {
  urls: { [key: string]: string };
}

interface INftImageUrlStorageMethods {
  addImageUrl: (address: string, id: BigNumberish, url: string) => void;
}

interface INftImageUrlStorageHook extends INftImageUrlStorageState, INftImageUrlStorageMethods {}

const defaultState: INftImageUrlStorageState = { urls: {} };

export const useNftImageUrlStorageStore = create<INftImageUrlStorageState>(
  persist(() => defaultState, {
    name: 'nftImageUrls',
    getStorage: () => localStorage,
  }) as any
);

export function addImageUrl(address: string, id: BigNumberish, url: string) {
  const { urls } = useNftImageUrlStorageStore.getState();
  const key = buildKey(address, id);
  useNftImageUrlStorageStore.setState({ urls: { ...urls, [key]: url } });
}

export function getImageUrl(address: string, id: BigNumberish) {
  const { urls } = useNftImageUrlStorageStore.getState();
  const key = buildKey(address, id);
  return urls[key];
}

function buildKey(address: string, id: BigNumberish) {
  const normalizedAddress = address.toLowerCase();
  const normalizedId = bigNumberishToString(id);

  return `${normalizedAddress}.${normalizedId}`;
}

export const useNftImageUrlStorage = (): INftImageUrlStorageHook => {
  const state = useNftImageUrlStorageStore();

  return {
    ...state,
    addImageUrl,
  };
};
