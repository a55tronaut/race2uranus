import { useEffect, useMemo, useState } from 'react';
import { BigNumberish, ethers } from 'ethers';
import { Typography } from 'antd';
import styled from 'styled-components';
import CountUp from 'react-countup';
import cn from 'classnames';

interface IProps {
  amount: BigNumberish;
  withName?: boolean;
}

const { Title } = Typography;

function MagicAmount({ amount, withName }: IProps) {
  const [digits, setDigits] = useState(1);

  const numAmount = useMemo(() => {
    return Number(ethers.utils.formatEther(amount || '0'));
  }, [amount]);

  useEffect(() => {
    const _digits = `${Math.floor(numAmount || 0)}`.length;
    setDigits(_digits);
  }, [numAmount]);

  return (
    <Container>
      <Title level={4}>
        <img src="/assets/magic.svg" alt="MAGIC" />{' '}
        <CountUp className={cn('countup', `digits${digits}`)} end={numAmount} decimals={2} preserveValue />{' '}
        {withName && 'MAGIC'}
      </Title>
    </Container>
  );
}

const Container = styled.span`
  vertical-align: middle;

  .ant-typography {
    display: inline-block;
    margin: 0;
  }

  img {
    width: 20px;
    vertical-align: middle;
    display: inline-block;
    margin-bottom: 4px;
  }

  .countup {
    display: inline-block;
    min-width: 70px;
    text-align: left;

    &.digits2 {
      min-width: 85px;
    }
    &.digits3 {
      min-width: 105px;
    }
    &.digits4 {
      min-width: 125px;
    }
    &.digits5 {
      min-width: 145px;
    }
    &.digits6 {
      min-width: 165px;
    }
  }
`;

export default MagicAmount;
