import { BigNumber, utils } from 'ethers';

import { supportedNfts } from './constants';
import { NFT_MAPPINGS } from './env';
import { ISupportedNft } from './types';

export function randomHeight(minHeight: number, maxHeight: number) {
  return Math.floor(Math.random() * maxHeight) + minHeight;
}

export function convertDecimals(bn: BigNumber, decimalsIn: number, decimalsOut = 18): BigNumber {
  const decimalsDiff = decimalsOut - decimalsIn;

  if (decimalsDiff > 0) {
    return BigNumber.from(bn.toString() + '0'.repeat(decimalsDiff));
  }
  if (decimalsDiff < 0) {
    const bnString = bn.toString();
    return BigNumber.from(bnString.substring(0, bnString.length + decimalsDiff) || '0');
  }

  return bn;
}

export function isTruthy(value: string): boolean {
  const valLower = (value || '').toLowerCase();
  return valLower === 'true' || valLower === '1';
}

export function shortAddress(address?: string | null | undefined, chars = 4): string {
  const prefix = (address || '').slice(0, 2);
  const id = (address || '').slice(prefix.length);
  return `${prefix}${shortId(id)}`;
}

export function shortId(id?: string | null | undefined, chars = 4): string {
  const _id = (id || '').toUpperCase();
  return `${_id.slice(0, chars - 1)}...${_id.slice(-chars)}`;
}

export function formatNumber(value: number, minDecimals = 0, maxDecimals = 2, fallbackValue = '-'): string {
  if (value) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals,
    });

    return formatter.format(value);
  }

  return fallbackValue;
}

export function formatCurrency(value: number, decimals = 2): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(value || 0);
}

export function calculatePercent(value: number, maxValue: number): number {
  return Math.round((value / maxValue) * 100);
}

export function capitalizeFirstLetter(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function isValidEthereumAddress(address: string): boolean {
  try {
    utils.getAddress(address);
    return true;
  } catch (e) {
    return false;
  }
}

export function ethereumAddressValidator(address: string): Promise<void> {
  return isValidEthereumAddress(address) ? Promise.resolve() : Promise.reject(new Error(`Invalid Ethereum address`));
}

export async function retryRpcCallOnIntermittentError<T>(fn: () => Promise<any>): Promise<T> {
  try {
    return await fn();
  } catch (e: any) {
    const intermittentRpcError = 'unsupported block number';
    const errorMessage = e?.message || '';
    if (errorMessage.includes(intermittentRpcError)) {
      await sleep(500);
      return await retryRpcCallOnIntermittentError(fn);
    } else {
      throw e;
    }
  }
}

export async function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function waitUntil(timestamp: number): Promise<void> {
  const now = Date.now();
  return sleep(timestamp - now);
}

export function mapNftAddress(address: string): string {
  const normalizedAddress = address.toLowerCase();
  const mappedAddress = NFT_MAPPINGS[normalizedAddress];

  return mappedAddress;
}

export function getNftConfig(address: string): ISupportedNft {
  const mappedAddress = mapNftAddress(address || '') || '';
  const config = supportedNfts.find((nft) => nft.address.toLowerCase() === mappedAddress.toLowerCase())!;

  return config;
}

export function runAfterRender(fn: Function) {
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => fn()));
}
