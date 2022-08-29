import { ethers } from 'ethers';

import Race2UranusABI from '../abi/Race2Uranus.json';
import { GAME_ADDRESS } from '../env';
import { Race2Uranus } from '../types';
import { signer } from './signer';

export const race2Uranus: Race2Uranus = new ethers.Contract(GAME_ADDRESS, Race2UranusABI, signer) as any;
