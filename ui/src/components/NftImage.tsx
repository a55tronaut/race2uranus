import { BigNumberish } from 'ethers';
import styled from 'styled-components';

import { useNftImageUrl } from '../hooks';

interface IProps {
  address: string;
  id: BigNumberish;
  className?: string;
}

function NftImage({ address, id, className }: IProps) {
  const { url } = useNftImageUrl(address, id);

  return <Img alt="" decoding="async" className={className} src={url} />;
}

const Img = styled.img``;

export default NftImage;
