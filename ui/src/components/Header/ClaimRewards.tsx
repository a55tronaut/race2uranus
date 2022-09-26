import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Typography, notification } from 'antd';
import styled from 'styled-components';
import { BigNumber, BigNumberish } from 'ethers';
import { useEthers } from '@usedapp/core';

import { useRaceContract, useSelectedRace } from '../../hooks';
import { FINAL_APPROACH_SECONDS, SECOND_MILLIS } from '../../constants';
import { extractRpcError } from '../../utils';
import MagicAmount from '../MagicAmount';

interface IProps {
  className?: string;
}

const { Text } = Typography;

function ClaimRewards({ className }: IProps) {
  const { statusMeta } = useSelectedRace();
  const { account } = useEthers();
  const { contract } = useRaceContract();
  const [rewards, setRewards] = useState<BigNumberish>(0);
  const [initialRefresh, setInitialRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const raceDone = useRef(true);

  const refreshRewards = useCallback(async () => {
    if (contract && account) {
      setInitialRefresh(true);
      const [amount] = await contract.functions.calcClaimableAmountAll(account);
      setRewards(amount);
    }
  }, [account, contract]);

  useEffect(() => {
    if (!initialRefresh && contract && account) {
      refreshRewards();
    }
  }, [account, contract, initialRefresh, refreshRewards]);

  useEffect(() => {
    contract?.on(contract.filters!.RaceFinished(), refreshRewards);

    return () => contract?.off(contract.filters!.RaceFinished(), refreshRewards) as any;
  }, [contract, refreshRewards]);

  useEffect(() => {
    if (!raceDone.current && statusMeta?.done) {
      setTimeout(() => {
        refreshRewards();
      }, FINAL_APPROACH_SECONDS * SECOND_MILLIS);
    } else if (statusMeta?.done) {
      refreshRewards();
    }
    raceDone.current = !!statusMeta?.done;
  }, [refreshRewards, statusMeta?.done]);

  const handleClaimRewards = useCallback(async () => {
    try {
      setLoading(true);
      const res = await contract!.functions.claimAll();
      await res.wait(1);
      setRewards(0);
      notification.success({ message: 'Succesfully claimed rewards!' });
    } catch (e) {
      console.error(e);
      const message = extractRpcError(e);
      notification.error({ message });
    } finally {
      setLoading(false);
    }
  }, [contract]);

  return (
    <Container className={className}>
      {BigNumber.from(rewards || '0').gt(0) && (
        <>
          <div className="rewards">
            <Text>Your Rewards</Text>
            <br />
            <MagicAmount amount={rewards} />
          </div>
          <Button className="claimBtn" type="ghost" size="small" loading={loading} onClick={handleClaimRewards}>
            💰 Claim
          </Button>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  margin: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 0;
  min-width: 160px;

  .rewards {
    flex: 0;
    white-space: nowrap;
    margin-right: 8px;
  }

  .claimBtn {
    position: absolute;
    bottom: 10px;
  }
`;

export default ClaimRewards;
