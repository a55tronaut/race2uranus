import { BigNumber, BigNumberish } from 'ethers';
import { useEffect, useState } from 'react';

import { useL1Block } from './useL1Block';

export function useTimeToL1Block(blockNumber: BigNumberish) {
  const { loading: l1Loading, currentBlock, avgBlockTimeMillis } = useL1Block();
  const [timeLeft, setTimeLeft] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [loading, setLoading] = useState(true);
  const [prevCurrentBlock, setPrevCurrentBlock] = useState(0);
  const [prevBlockNumber, setPrevBlockNumber] = useState<BigNumberish>(0);

  useEffect(() => {
    if (l1Loading) {
      return;
    }

    if (currentBlock === prevCurrentBlock && BigNumber.from(blockNumber || 0).eq(prevBlockNumber || 0)) {
      return;
    }

    const blockNum = BigNumber.from(blockNumber || '0').toNumber();
    const blockDiff = blockNum - currentBlock;

    if (blockDiff > 0) {
      const _timeLeft = Math.floor(blockDiff * avgBlockTimeMillis);
      const _timestamp = Math.floor(Date.now() + _timeLeft);
      setTimeLeft(_timeLeft);
      setTimestamp(_timestamp);
    } else {
      setTimeLeft(0);
      setTimestamp(0);
    }

    setPrevBlockNumber(blockNumber);
    setPrevCurrentBlock(currentBlock);
    setLoading(false);
  }, [avgBlockTimeMillis, blockNumber, currentBlock, l1Loading, prevBlockNumber, prevCurrentBlock]);

  return { loading, timeLeft, timestamp };
}
