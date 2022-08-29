import { config } from 'dotenv';

config();

export const LOG_LEVEL = defaultString('LOG_LEVEL', 'info');

// tslint:disable-next-line: no-console
console.log('LOG LEVEL:', LOG_LEVEL);

export const PORT = requiredNumber('PORT');
export const DB_URI = requiredString('DB_URI');

export const CHAIN_ID = requiredNumber('CHAIN_ID');
export const RPC_URL = requiredString('RPC_URL');
export const GAME_ADDRESS = requiredString('GAME_ADDRESS');
export const SIGNER_PK = requiredString('SIGNER_PK');

///////////////////////////////////////////////////////

function defaultString(key: string, defaultVal: string): string {
  return process.env[key] || defaultVal;
}

function requiredNumber(key: string): number {
  const val = required(key);
  const num = Number(val);

  if (isNaN(num)) {
    throw new Error(`Env var ${key} is not a number`);
  }

  return num;
}

function requiredBoolean(key: string): boolean {
  const val = required(key).toLowerCase();
  const truthyVals = ['true', '1'];
  const falsyVals = ['false', '0'];
  const acceptedVals = [...truthyVals, ...falsyVals];

  if (!acceptedVals.includes(val)) {
    throw new Error(`Env var ${key} is not a boolean`);
  }

  return truthyVals.includes(val);
}

function requiredString(key: string): string {
  return required(key);
}

function required(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Missing required env var ${key}`);
  }

  return val;
}
