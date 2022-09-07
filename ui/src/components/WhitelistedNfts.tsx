import { useMemo } from 'react';
import styled from 'styled-components';

import { getNftConfig } from '../utils';

interface IProps {
  whitelist: string[];
}

function WhitelistedNfts({ whitelist }: IProps) {
  const nfts = useMemo(() => {
    return (whitelist || []).map(getNftConfig);
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
