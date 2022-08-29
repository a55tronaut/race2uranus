import { ethers } from 'ethers';

import { RPC_URL } from '../env';

export const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
