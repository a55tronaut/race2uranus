import { ethers } from 'ethers';

import { SIGNER_PK } from '../env';
import { provider } from './provider';

export const signer = new ethers.Wallet(SIGNER_PK, provider);
