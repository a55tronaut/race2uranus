import axios from 'axios';
import { BigNumberish } from 'ethers';
import create from 'zustand';

import { NFT_META_URL } from '../env';
import { getNftConfig, mapNftAddress } from '../utils';
import { addMeta, getMeta, getStorageKey, INftMeta } from './useNftMetaStorage';

interface INftMetaState {
  promises: { [key: string]: Promise<INftMeta> };
}

interface INftMetaMethods {
  fetchMeta: (address: string, id: BigNumberish) => Promise<INftMeta>;
}

interface INftMetaHook extends INftMetaState, INftMetaMethods {}

const defaultState: INftMetaState = { promises: {} };

const useNftMetaStore = create<INftMetaState>(() => defaultState);

const metaApi = axios.create({ baseURL: NFT_META_URL });

async function fetchMeta(address: string, id: BigNumberish) {
  const cachedStorageValue = getMeta(address, id);

  if (cachedStorageValue) {
    return cachedStorageValue;
  }

  const { promises } = useNftMetaStore.getState();
  const key = getStorageKey(address, id);
  const cachedPromise = promises[key];
  if (cachedPromise) {
    return cachedPromise;
  }

  const promise = (async () => {
    try {
      const mappedAddress = mapNftAddress(address);
      const { data } = await metaApi.get(`${mappedAddress}/${id.toString()}`);
      const url = data.image?.imageUri || getNftConfig(mappedAddress).img;
      const name = data.metadata?.name || `${getNftConfig(mappedAddress).name} #${id.toString()}`;
      const meta: INftMeta = { name, url };
      addMeta(address, id, meta);

      return meta;
    } catch (e) {
      console.error(e);
      throw e;
    }
  })();

  useNftMetaStore.setState({ promises: { ...promises, [key]: promise } });

  return promise;
}

export const useNftMetas = (): INftMetaHook => {
  const state = useNftMetaStore();

  return {
    ...state,
    fetchMeta,
  };
};
