import { useMemo } from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';

import { useSelectedRace } from '../../hooks';
import MagicAmount from '../MagicAmount';

const { Text } = Typography;

function RewardPool() {
  const { race } = useSelectedRace();

  const rewardPool = useMemo(() => {
    const maxRacerStake = race?.configSnapshot.minStakeAmount.mul(race?.configSnapshot.maxRockets);
    const currentPool = race?.rewardPool;

    if (maxRacerStake && currentPool) {
      return currentPool.gt(maxRacerStake) ? currentPool : maxRacerStake;
    }

    return 0;
  }, [race?.configSnapshot.maxRockets, race?.configSnapshot.minStakeAmount, race?.rewardPool]);

  return (
    <Container>
      <Text>Reward Pool</Text>
      <br />
      <MagicAmount amount={rewardPool} />
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  margin: 0 3em;
  min-width: 160px;
`;
export default RewardPool;
