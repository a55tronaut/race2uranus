export const CHAIN_ID = requiredNumber('REACT_APP_CHAIN_ID');
export const RPC_URL = requiredString('REACT_APP_RPC_URL');

export const GAME_ADDRESS = requiredString('REACT_APP_GAME_ADDRESS');
export const MAGIC_ADDRESS = requiredString('REACT_APP_MAGIC_ADDRESS');

export const NFT_META_URL = requiredString('REACT_APP_NFT_META_URL');
export const NFT_MAPPINGS = parseNftMappings(defaultString('REACT_APP_NFT_MAPPINGS', ''));

export const API_URL = requiredString('REACT_APP_API_URL');

///////////////////////////////////////////////////////

function parseNftMappings(rawMappins: string): { [key: string]: string } {
  const mappings: any = {};

  rawMappins.split('\n').forEach((row) => {
    const strippedRow = row.split('#')[0].trim();
    if (strippedRow) {
      const [from, to] = strippedRow.split(':').map((addr) => addr.toLowerCase());
      mappings[from] = to;
    }
  });

  return mappings;
}

///////////////////////////////////////////////////////

function defaultString(key: string, defaultVal: string): string {
  return process.env[key] || defaultVal;
}

function requiredString(key: string): string {
  return required(key);
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

function required(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Missing required env var ${key}`);
  }

  return val;
}
