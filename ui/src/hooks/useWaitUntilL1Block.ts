import { BigNumber, BigNumberish } from 'ethers';
import { useEffect, useState } from 'react';

import { useL1Block } from './useL1Block';

export function useWaitUntilL1Block(blockNumber: BigNumberish) {
  const { loading, currentBlock, avgBlockTimeMillis } = useL1Block();
  const [reached, setReached] = useState(false);

  useEffect(() => {
    const blockNum = BigNumber.from(blockNumber || '0').toNumber();
    if (!loading && !reached && blockNum > 0 && currentBlock >= blockNum) {
      setReached(true);
    }
  }, [avgBlockTimeMillis, blockNumber, currentBlock, loading, reached]);

  return reached;
}
