import { useEthers } from '@usedapp/core';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { MAINNET_CHAIN_ID } from '../constants';
import { useNftContract } from './useNftContract';

interface INftsForUser {
  [key: string]: string[];
}

const graphApi = axios.create({
  baseURL: 'https://api.thegraph.com/subgraphs/name/vinnytreasure/erc721arbitrum',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function useNftsForUser(addresses: string[]) {
  const { account, chainId } = useEthers();
  const { makeNftContract } = useNftContract();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nfts, setNfts] = useState<INftsForUser>({});
  const [executed, setExecuted] = useState(false);

  useEffect(() => {
    if (!executed && account && addresses && chainId) {
      setExecuted(true);
      if (chainId === MAINNET_CHAIN_ID) {
        getNftsForUser_TheGraph(account, addresses);
      } else {
        getNftsForUser_MultiContract(account, addresses);
      }
    }
    async function getNftsForUser_TheGraph(account: string, addresses: string[]) {
      try {
        setLoading(true);
        const nfts: INftsForUser = {};
        const query = `query getNFTsOwnedByAddress($address: ID!, $where: Token_filter) {
          owner(id: $address) {
            tokens(
              where: $where
              orderBy: id
              orderDirection: asc
            ) {
              tokenID
              contract {
                id
              }
            }
            numTokens
          }
        }`;

        const { data } = await graphApi.post('', {
          query,
          variables: {
            address: account,
            where: {
              contract_in: addresses.map((addr) => addr.toLowerCase()),
            },
          },
          operationName: 'getNFTsOwnedByAddress',
        });

        data.data.owner.tokens.forEach((token: any) => {
          const contractAddr = addresses.find((addr) => addr.toLowerCase() === token.contract.id.toLowerCase())!;
          nfts[contractAddr] = nfts[contractAddr] || [];
          nfts[contractAddr].push(token.tokenID);
        });

        setNfts(nfts);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    async function getNftsForUser_MultiContract(account: string, addresses: string[]) {
      try {
        setLoading(true);
        const res: INftsForUser = {};
        const ids = await Promise.all(addresses.map((addr) => getNftsForUser_Contract(account, addr)));
        for (let i = 0; i < addresses.length; i++) {
          res[addresses[i]] = ids[i];
        }

        setNfts(res);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    async function getNftsForUser_Contract(account: string, address: string) {
      const contract = makeNftContract(address);
      const [balanceBn] = await contract!.functions.balanceOf(account!);
      const balance = balanceBn.toNumber();
      const ids = [];

      for (let i = 0; i < balance; i++) {
        const [index] = await contract!.functions.tokenOfOwnerByIndex(account!, i);
        ids.push(index.toString());
      }

      return ids;
    }
  }, [account, addresses, chainId, executed, makeNftContract]);

  return {
    nfts,
    loading,
    error,
  };
}
