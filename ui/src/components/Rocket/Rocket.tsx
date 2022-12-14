import { Tooltip } from 'antd';
import { BigNumberish } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import cn from 'classnames';

import { SECOND_MILLIS } from '../../constants';
import { useNftDominantColor } from '../../hooks';
import NftImage from '../NftImage';
import NftName from '../NftName';
import { ReactComponent as RocketSvg } from './rocket.svg';

interface IProps {
  address?: string;
  nftId?: BigNumberish;
  className?: string;
  boostCount?: number;
  animate?: boolean;
}

function Rocket({ address, nftId, className, boostCount, animate }: IProps) {
  const { color } = useNftDominantColor(address, nftId);
  const [boostClassName, setBoostClassName] = useState('');
  const prevBoostCount = useRef(boostCount || 0);

  useEffect(() => {
    if (boostCount && boostCount > prevBoostCount.current) {
      setBoostClassName('boosting');
      prevBoostCount.current = boostCount;

      setTimeout(() => {
        setBoostClassName('');
      }, 4 * SECOND_MILLIS);
    }
  }, [boostCount]);

  return (
    <Tooltip title={address && nftId ? <NftName address={address!} id={nftId!} /> : undefined} placement="top">
      <Container color={color} className={cn(className, { animate })}>
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

  &.animate {
    animation: bobbing 7s ease-in-out infinite;
  }

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

  @keyframes bobbing {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5%);
    }
    100% {
      transform: translateY(0);
    }
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
  pointer-events: none;

  &.boosting {
    transition: opacity 2s ease;
    opacity: 0.8;
  }
`;

export default Rocket;
