import { BigNumberish } from 'ethers';
import styled from 'styled-components';

import { useNftMeta } from '../hooks';

interface IProps {
  address: string;
  id: BigNumberish;
  className?: string;
}

function NftImage({ address, id, className }: IProps) {
  const { meta } = useNftMeta(address, id);

  return <Img alt="" decoding="async" className={className} src={meta?.url} />;
}

const Img = styled.img``;

export default NftImage;
