import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRaceContract } from '../hooks';

function LandingPage() {
  const navigate = useNavigate();
  const { contract } = useRaceContract();

  useEffect(() => {
    if (contract.functions?.getActiveRaceIds) {
      redirectToActiveRace();
    }
    async function redirectToActiveRace() {
      const [raceId] = await contract?.functions?.getActiveRaceIds()!;
      navigate(`/race/${raceId.toString()}`, { replace: true });
    }
  }, [contract, navigate]);

  return <div />;
}

export default LandingPage;
