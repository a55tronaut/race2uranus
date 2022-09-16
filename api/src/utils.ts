import { BigNumberish, ethers } from 'ethers';
import { Cache } from 'memory-cache';
import mongoose from 'mongoose';

interface ICache<T> {
  put: (key: string, value: T, ttl?: number) => T;
  get: (key: string) => T;
  has: (key: string) => boolean;
  keys: () => T[];
}

export function createTimedCache<T>(ttlMillis?: number): ICache<T> {
  const cache = new Cache();

  return {
    put: (key: string, value: any, ttl = ttlMillis) => cache.put(key, value, ttl) as any,
    get: (key: string) => cache.get(key) as any,
    has: (key: string) => !!cache.get(key),
    keys: () => cache.keys() as any,
  };
}

const universalCache = createTimedCache<any>();

export async function getFromCacheOrFetch<T>({
  key,
  ttlMillis,
  fetchValue,
}: {
  key: string;
  ttlMillis: number;
  fetchValue: () => Promise<T>;
}): Promise<T> {
  if (universalCache.has(key)) {
    return universalCache.get(key);
  }

  const valuePromise = fetchValue();

  universalCache.put(key, valuePromise, ttlMillis);

  return valuePromise;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitUntil(timestamp: number): Promise<void> {
  const now = Date.now();
  return sleep(timestamp - now);
}

export async function waitForDb(): Promise<void> {
  if (mongoose.connection.readyState === mongoose.ConnectionStates.connected) {
    return;
  }
  return new Promise((resolve) => mongoose.connection.once('open', resolve));
}

export function weiToNumber(wei: BigNumberish): number {
  return Number(ethers.utils.formatEther(wei));
}
