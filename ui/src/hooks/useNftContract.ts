import { Contract } from 'ethers';
import { useCallback } from 'react';

import ERC721ABI from '../abi/ERC721.json';
import { SimpleNft } from '../types';
import { useEthersSigner } from './useEthersSigner';

export function useNftContract() {
  const { signer } = useEthersSigner();

  const makeNftContract = useCallback(
    (address: string) => {
      if (signer) {
        const contract: any = new Contract(address, ERC721ABI, signer);
        return contract as SimpleNft;
      }
    },
    [signer]
  );

  return {
    makeNftContract,
  };
}
