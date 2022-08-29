import { ethers } from 'ethers';

import ERC721ABI from '../abi/ERC721.json';
import { SimpleNft } from '../types';
import { signer } from './signer';

export function makeErc721Contract(address: string): SimpleNft {
  return new ethers.Contract(address, ERC721ABI, signer) as any;
}
