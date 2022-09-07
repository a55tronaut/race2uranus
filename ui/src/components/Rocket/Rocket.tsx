import { BigNumberish } from 'ethers';
import styled from 'styled-components';

import { useNftDominantColor } from '../../hooks';
import NftImage from '../NftImage';
import { ReactComponent as RocketSvg } from './rocket.svg';

interface IProps {
  address: string;
  nftId: BigNumberish;
  className?: string;
}

function Rocket({ address, nftId, className }: IProps) {
  const { color } = useNftDominantColor(address, nftId);

  return (
    <Container color={color} className={className}>
      <Porthole>
        <NftImage address={address} id={nftId} className="nftImg" />
      </Porthole>
      <RocketSvg className="rocket" />
    </Container>
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
