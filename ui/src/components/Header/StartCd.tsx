import { useParams } from 'react-router-dom';
import { Typography } from 'antd';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

import { useRaceContract } from '../../hooks';

const { Title, Text } = Typography;

function StartCd() {
  const { raceId } = useParams();
  const { contract } = useRaceContract();
  const [raceStarted, setRaceStarted] = useState('');
  useEffect(() => {
    if (contract.functions?.getTimeParams!) {
      refreshRaceAttrs();
    }
    async function refreshRaceAttrs() {
      const [race] = await contract.functions?.getTimeParams()!;
      setRaceStarted(race.blockTimeMillis.toString());
    }
  }, [contract.functions, raceId]);

  return (
    <RaceCounter>
      <Text>Started</Text>
      <Title level={4} className="number">
        {raceStarted}
      </Title>
    </RaceCounter>
  );
}

const RaceCounter = styled.div`
  text-align: center;
  margin: 0 3em;
  .number {
    width: 100px;
  }
`;

export default StartCd;
