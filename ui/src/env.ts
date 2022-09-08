export const CHAIN_ID = env('REACT_APP_CHAIN_ID', 'number');
export const RPC_URL = env('REACT_APP_RPC_URL', 'string');

export const GAME_ADDRESS = env('REACT_APP_GAME_ADDRESS', 'string');
export const MAGIC_ADDRESS = env('REACT_APP_MAGIC_ADDRESS', 'string');

export const NFT_META_URL = env('REACT_APP_NFT_META_URL', 'string');
export const NFT_MAPPINGS = parseNftMappings(env('REACT_APP_NFT_MAPPINGS', 'string', ''));

export const API_URL = env('REACT_APP_API_URL', 'string');

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

type EnvValType = {
  string: string;
  number: number;
  boolean: boolean;
};
type EnvDataType = keyof EnvValType;

function env<T extends EnvDataType>(key: string, dataType: T, defaultVal?: EnvValType[T]): EnvValType[T] {
  let val: any = process.env[key] || defaultVal;

  const isRequired = defaultVal === undefined;

  if (isRequired && !val) {
    throw new Error(`Missing required env var ${key}`);
  }

  switch (dataType) {
    case 'string': {
      return val;
    }
    case 'number': {
      const num = Number(val);

      if (isNaN(num)) {
        throw new Error(`Env var ${key} is not a number`);
      }

      return num as any;
    }
    case 'boolean': {
      const normalizedVal = val.toLowerCase();
      const truthyVals = ['true', '1'];
      const falsyVals = ['false', '0'];
      const acceptedVals = [...truthyVals, ...falsyVals];

      if (!acceptedVals.includes(normalizedVal)) {
        throw new Error(`Env var ${key} is not a boolean`);
      }

      return truthyVals.includes(normalizedVal) as any;
    }
    default: {
      throw new Error(`Unsupported data type: ${dataType}`);
    }
  }
}
