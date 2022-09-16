import { BigNumberish } from 'ethers';

import { useNftMeta } from '../hooks';

interface IProps {
  address: string;
  id: BigNumberish;
  className?: string;
}

function NftName({ address, id, className }: IProps) {
  const { meta } = useNftMeta(address, id);

  return <span className={className}>{meta?.name}</span>;
}

export default NftName;
