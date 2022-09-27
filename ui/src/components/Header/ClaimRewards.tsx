import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, notification } from 'antd';
import styled from 'styled-components';
import { BigNumber, BigNumberish } from 'ethers';
import { useEthers } from '@usedapp/core';
import debounce from 'lodash/debounce';
import cn from 'classnames';

import { useRaceContract, useRaceMetaWitness, useSelectedRace } from '../../hooks';
import { FINAL_APPROACH_SECONDS, SECOND_MILLIS } from '../../constants';
import { extractRpcError } from '../../utils';
import MagicAmount from '../MagicAmount';

interface IProps {
  className?: string;
}

function ClaimRewards({ className }: IProps) {
  const { account } = useEthers();
  const { statusMeta } = useSelectedRace();
  const { seenInProgress } = useRaceMetaWitness(statusMeta!);
  const { contract } = useRaceContract();
  const [rewards, setRewards] = useState<BigNumberish>(0);
  const [loading, setLoading] = useState(false);

  const visible = useMemo(() => BigNumber.from(rewards || '0').gt(0), [rewards]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refreshRewards = useCallback(
    debounce(async () => {
      if (contract && account) {
        const [amount] = await contract.functions.calcClaimableAmountAll(account);
        setRewards(amount);
      }
    }, 300),
    [account, contract]
  );

  useEffect(() => {
    if (contract && account) {
      refreshRewards();
    }
  }, [account, contract, refreshRewards]);

  useEffect(() => {
    if (statusMeta?.done && seenInProgress) {
      setTimeout(() => {
        refreshRewards();
      }, FINAL_APPROACH_SECONDS * SECOND_MILLIS);
    } else if (statusMeta?.done) {
      refreshRewards();
    }
  }, [refreshRewards, seenInProgress, statusMeta?.done]);

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
    <Container className={cn(className, { visible })}>
      <strong>
        You have <MagicAmount amount={rewards} /> in unclaimed rewards!
      </strong>{' '}
      <Button className="claimBtn" type="ghost" size="small" loading={loading} onClick={handleClaimRewards}>
        💰 Claim
      </Button>
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  padding: 12px 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-image: linear-gradient(to right, rgb(91, 66, 254), rgb(89, 0, 176));
  transition: all 0.4s ease;
  height: 54px;
  margin-top: -54px;

  &.visible {
    margin-top: 0px;
  }

  .claimBtn {
    margin-left: 16px;
    height: 30px;

    &:not(:hover) {
      border: 1px solid white;
    }
  }
`;

export default ClaimRewards;
