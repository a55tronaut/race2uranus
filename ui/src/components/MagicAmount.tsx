import { useMemo } from 'react';
import { BigNumberish, ethers } from 'ethers';
import { Typography } from 'antd';
import styled from 'styled-components';

import { formatNumber } from '../utils';

interface IProps {
  amount: BigNumberish;
  withName?: boolean;
}

const { Title } = Typography;

function MagicAmount({ amount, withName }: IProps) {
  const formattedAmount = useMemo(() => {
    return formatNumber(Number(ethers.utils.formatEther(amount)));
  }, [amount]);

  return (
    <Container>
      <Title level={4}>
        <img src="/assets/magic.svg" alt="MAGIC" /> {formattedAmount} {withName && 'MAGIC'}
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
`;

export default MagicAmount;
