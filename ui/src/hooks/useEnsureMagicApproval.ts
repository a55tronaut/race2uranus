import { useEthers } from '@usedapp/core';
import { BigNumberish, ethers } from 'ethers';
import { useCallback } from 'react';

import { GAME_ADDRESS } from '../env';
import { useMagicToken } from './useMagicToken';

export function useEnsureMagicApproval() {
  const { contract } = useMagicToken();
  const { account } = useEthers();

  const ensureApproval = useCallback(
    async (requiredAmount: BigNumberish) => {
      const [currentAllowance] = await contract.functions?.allowance(account!, GAME_ADDRESS)!;
      if (currentAllowance.lt(requiredAmount)) {
        await contract.functions?.approve(GAME_ADDRESS, ethers.constants.MaxUint256);
      }
    },
    [account, contract.functions]
  );

  return { ensureApproval };
}
