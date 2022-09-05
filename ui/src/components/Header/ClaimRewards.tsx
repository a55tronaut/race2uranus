import { Button, message } from 'antd';
import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useEthers } from '@usedapp/core';

import { useRaceContract } from '../../hooks';

function ClaimRewards() {
  const { account } = useEthers();
  const { contract } = useRaceContract();
  const [rewards, setRewards] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshRewards = useCallback(async () => {
    if (contract.functions && account) {
      const [amount] = await contract.functions.calcClaimableAmountAll(account);
      setRewards(Number(ethers.utils.formatEther(amount)));
    }
  }, [account, contract]);

  useEffect(() => {
    refreshRewards();
  }, [refreshRewards]);

  useEffect(() => {
    if (contract.on) {
      contract.on(contract.filters!.RaceFinished(), refreshRewards);
    }

    return () => {
      if (contract.off) {
        contract.off(contract.filters!.RaceFinished(), refreshRewards);
      }
    };
  }, [contract, refreshRewards]);

  const handleClaimRewards = useCallback(async () => {
    try {
      setLoading(true);
      await contract.functions!.claimAll();
      setRewards(0);
      message.success({ content: 'Succesfully claimed rewards' });
    } finally {
      setLoading(false);
    }
  }, [contract.functions]);

  return (
    <Container>
      {rewards > 0 && (
        <Button type="ghost" loading={loading} onClick={handleClaimRewards}>
          Claim rewards
        </Button>
      )}
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  margin: 8px;
`;

export default ClaimRewards;
