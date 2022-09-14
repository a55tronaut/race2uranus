import { Typography } from 'antd';
import styled from 'styled-components';

import { useSelectedRace } from '../../hooks';
import MagicAmount from '../MagicAmount';

const { Text } = Typography;

function RewardPool() {
  const { race } = useSelectedRace();

  return (
    <Container>
      <Text>Reward Pool</Text>
      <br />
      <MagicAmount amount={race?.rewardPool!} />
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  margin: 0 3em;
  min-width: 160px;
`;
export default RewardPool;
