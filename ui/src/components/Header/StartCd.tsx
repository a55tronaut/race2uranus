import { Typography } from 'antd';
import styled from 'styled-components';

import BLockNumberEst from './BlockNumberEst';

const { Title, Text } = Typography;

function StartCd() {
  return (
    <RaceCounter>
      <Text>Started</Text>
      <Title level={4}>
        <BLockNumberEst />
      </Title>
    </RaceCounter>
  );
}

const RaceCounter = styled.div`
  text-align: center;
  margin: 0 3em;
`;

export default StartCd;
