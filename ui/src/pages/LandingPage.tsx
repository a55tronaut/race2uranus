import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import styled from 'styled-components';

import { Header, Layout } from '../components';
import { useRaceContract } from '../hooks';

function LandingPage() {
  const navigate = useNavigate();
  const { contract } = useRaceContract();
  const [noActiveRaces, setNoActiveRaces] = useState(false);

  useEffect(() => {
    if (contract) {
      redirectToActiveRace();
    }
    async function redirectToActiveRace() {
      const [raceIds] = await contract!.functions.getActiveRaceIds()!;

      if (raceIds[0]) {
        navigate(`/race/${raceIds[0].toString()}`, { replace: true });
      } else {
        setNoActiveRaces(true);
      }
    }
  }, [contract, navigate]);

  return (
    <Layout>
      <Header />
      {noActiveRaces && (
        <NoRaces>
          <Typography.Title level={3}>
            There are currently no active races
            <br />
            but you can check back later to join the <strong>Race2Uranus</strong>!
          </Typography.Title>
        </NoRaces>
      )}
    </Layout>
  );
}

const NoRaces = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .ant-typography {
    text-align: center;
    line-height: 200% !important;
  }
`;

export default LandingPage;
