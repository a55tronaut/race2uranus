import { Tooltip } from 'antd';
import { BigNumberish } from 'ethers';
import { useMemo } from 'react';
import styled from 'styled-components';

import { useNftDominantColor } from '../../hooks';
import { getNftConfig } from '../../utils';
import NftImage from '../NftImage';
import { ReactComponent as RocketSvg } from './rocket.svg';

interface IProps {
  address: string;
  nftId: BigNumberish;
  className?: string;
}

function Rocket({ address, nftId, className }: IProps) {
  const { color } = useNftDominantColor(address, nftId);

  const title = useMemo(() => {
    if (address) {
      const nftConfig = getNftConfig(address);
      return `${nftConfig.name} #${nftId.toString()}`;
    }

    return '';
  }, [address, nftId]);

  return (
    <Tooltip title={title} placement="top">
      <Container color={color} className={className}>
        <Porthole>
          <NftImage address={address} id={nftId} className="nftImg" />
        </Porthole>
        <RocketSvg className="rocket" />
      </Container>
    </Tooltip>
  );
}

const Container = styled.div`
  width: 100%;
  position: relative;

  .st6,
  .st10 {
    transition: fill 0.2s ease;
    fill: ${(props) => props.color};
  }
  .rocket {
    width: 100%;
    height: 100%;
  }
  .nftImg {
    width: 100%;
  }
`;

const Porthole = styled.div`
  width: 74%;
  position: absolute;
  left: 52%;
  top: 13.5%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  mask: url('/assets/rocketPortholeMask.svg');
`;

export default Rocket;
