import axios from 'axios';
import { BigNumber, BigNumberish } from 'ethers';
import create from 'zustand';

import { NFT_MAPPINGS, NFT_META_URL } from '../env';
import { bigNumberishToString } from '../utils';
import { addImageUrl, getImageUrl } from './useNftImageUrlStorage';

interface INftImageUrlsState {
  promises: { [key: string]: Promise<string> };
}

interface INftImageUrlsMethods {
  fetchImageUrl: (address: string, id: BigNumberish) => Promise<string>;
}

interface INftImageUrlsHook extends INftImageUrlsState, INftImageUrlsMethods {}

const defaultState: INftImageUrlsState = { promises: {} };

const useNftImageUrlsStore = create<INftImageUrlsState>(() => defaultState);

const metaApi = axios.create({ baseURL: NFT_META_URL });

async function fetchImageUrl(address: string, id: BigNumberish) {
  const cachedStorageValue = getImageUrl(address, id);

  if (cachedStorageValue) {
    return cachedStorageValue;
  }

  const { promises } = useNftImageUrlsStore.getState();
  const key = buildKey(address, id);
  const cachedPromise = promises[key];
  if (cachedPromise) {
    return cachedPromise;
  }

  const promise = (async () => {
    try {
      const normalizedAddress = address.toLowerCase();
      const mappedAddress = NFT_MAPPINGS[normalizedAddress] || normalizedAddress;
      const { data } = await metaApi.get(`${mappedAddress}/${BigNumber.from(id.toString())}`);
      const url = data.image.imageUri;
      addImageUrl(address, id, url);

      return url;
    } catch (e) {
      console.error(e);
      throw e;
    }
  })();

  useNftImageUrlsStore.setState({ promises: { ...promises, [key]: promise } });

  return promise;
}

function buildKey(address: string, id: BigNumberish) {
  const normalizedAddress = address.toLowerCase();
  const normalizedId = bigNumberishToString(id);

  return `${normalizedAddress}.${normalizedId}`;
}

export const useNftImageUrls = (): INftImageUrlsHook => {
  const state = useNftImageUrlsStore();

  return {
    ...state,
    fetchImageUrl,
  };
};
