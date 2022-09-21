import { useMemo } from 'react';
import styled from 'styled-components';
import { supportedNfts } from '../constants';

import { mapNftAddress } from '../utils';

interface IProps {
  whitelist?: string[];
}

const allAddresses = supportedNfts.map((item) => item.address);

function WhitelistedNfts({ whitelist }: IProps) {
  const nfts = useMemo(() => {
    const mappedWhitelist = (whitelist || allAddresses).map(mapNftAddress).map((address) => address.toLowerCase());
    return supportedNfts.filter((nft) => mappedWhitelist.includes(nft.address.toLowerCase()));
  }, [whitelist]);

  return (
    <Ul>
      {nfts.map((nft) => (
        <li key={nft.id}>
          <a href={nft.url} target="_blank" rel="noreferrer">
            {nft.name}
          </a>
        </li>
      ))}
    </Ul>
  );
}

const Ul = styled.ul``;

export default WhitelistedNfts;
