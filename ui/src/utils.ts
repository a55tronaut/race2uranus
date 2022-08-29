import { BigNumber, BigNumberish, ethers, utils } from 'ethers';
import { parseUrl } from 'query-string';

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
  // eslint-disable-next-line eqeqeq
  return value === 'true' || value == '1';
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

export function formatNumber(value: number, decimals = 4, fallbackValue = '-'): string {
  if (value) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
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

export function calAvgBlockCreation(startTime: number, endTime: number, blocksPassed: number): number {
  return (endTime - startTime) / blocksPassed;
}

export function calcEstBlockCreation(avgTimePerBlock: number, targetBlock: number): number {
  return Math.floor(avgTimePerBlock * targetBlock);
}

export function convertSeconds(seconds: number): string {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
}

export function bigNumberishToString(bnish: BigNumberish): string {
  return BigNumber.from(bnish).toString();
}
