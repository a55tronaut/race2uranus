import { Tooltip } from 'antd';
import { BigNumberish } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { SECOND_MILLIS } from '../../constants';
import { useNftDominantColor } from '../../hooks';
import { getNftConfig } from '../../utils';
import NftImage from '../NftImage';
import { ReactComponent as RocketSvg } from './rocket.svg';

interface IProps {
  address?: string;
  nftId?: BigNumberish;
  className?: string;
  boostCount?: number;
}

function Rocket({ address, nftId, className, boostCount }: IProps) {
  const { color } = useNftDominantColor(address, nftId);
  const [boostClassName, setBoostClassName] = useState('');
  const [prevBoostCount, setPrevBoostCount] = useState(boostCount);

  const title = useMemo(() => {
    if (address) {
      const nftConfig = getNftConfig(address);
      return `${nftConfig.name} #${nftId?.toString()}`;
    }

    return '';
  }, [address, nftId]);

  useEffect(() => {
    if (boostCount && boostCount > prevBoostCount!) {
      setBoostClassName('boosting');
      setPrevBoostCount(boostCount);

      setTimeout(() => {
        setBoostClassName('');
      }, 4 * SECOND_MILLIS);
    }
  }, [boostCount, prevBoostCount]);

  return (
    <Tooltip title={title} placement="top">
      <Container color={color} className={className}>
        <Porthole>{!!address && !!nftId && <NftImage address={address} id={nftId} className="nftImg" />}</Porthole>
        <RocketSvg className="rocket" />
        <Boost className={boostClassName} src="/assets/boost.svg" />
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

const Boost = styled.img`
  width: 256%;
  position: absolute;
  left: 50%;
  top: -30%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 4s ease;

  &.boosting {
    transition: opacity 2s ease;
    opacity: 0.8;
  }
`;

export default Rocket;
