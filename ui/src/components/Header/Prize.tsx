import { useParams } from 'react-router-dom';
import { Typography } from 'antd';
import styled from 'styled-components';

import { useRace } from '../../hooks';

const { Title, Text } = Typography;

function Prize() {
  const { raceId } = useParams();
  const race = useRace(raceId!);
  const rewardAmount = race.rewardPool!;

  return (
    <PrizeMagic>
      <Text>Prize</Text>
      <Title className="magic" level={4}>
        2550
      </Title>
    </PrizeMagic>
  );
}

const PrizeMagic = styled.div`
  text-align: center;
  margin: 0 3em;

  h4.ant-typography {
    margin-top: 0;
    margin-bottom: 0;
  }

  .magic:before {
    content: '';
    display: block;
    background: url('../assets/magic.svg') no-repeat;
    width: 20px;
    height: 20px;
    float: left;
    margin: 2px 6px 0 0;
  }
`;
export default Prize;
