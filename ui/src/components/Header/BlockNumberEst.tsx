import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { calAvgBlockCreation, calcEstBlockCreation, convertSeconds } from '../../utils';

function BLockNumberEst() {
  const [timer, setTimer] = useState('');

  // useEffect(() => {
  //   setInterval(async function getBlockNumber(): Promise<void> {
  //     const arb_provider = 'https://arb1.arbitrum.io/rpc';
  //     const provider = new ethers.providers.JsonRpcProvider(arb_provider);
  //     const latestBlock = await provider.getBlockNumber();
  //     const tsLatestBlock = (await provider.getBlock(latestBlock)).timestamp;

  //     const passedBlocks = 1000;
  //     const prevBlock = latestBlock - passedBlocks;
  //     const tsPrevBlock = (await provider.getBlock(prevBlock)).timestamp;

  //     const avgBlockTime = calAvgBlockCreation(tsPrevBlock, tsLatestBlock, passedBlocks);

  //     const nextBlock = 10000;
  //     const estBlockCreation = calcEstBlockCreation(avgBlockTime, nextBlock);

  //     setTimer(convertSeconds(estBlockCreation));
  //   }, 6000);
  // }, []);

  return (
    <>
      <div>{timer}</div>
    </>
  );
}

export default BLockNumberEst;
