import { useMemo } from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';

import { useSelectedRace } from '../../hooks';
import NotFound from '../NotFound';
import DestroyAsteroid from '../DestroyAsteroid';
import Background from './Background';
import PreRace from './PreRace';
import LaunchCountdown from './LaunchCountdown';
import Rockets from './Rockets';
import Winner from './Winner';

function Race() {
  const { loading, race, statusMeta, error, refresh } = useSelectedRace();

  const content = useMemo(() => {
    if (error) {
      return <NotFound />;
    }

    if (loading) {
      return <Spin className="loader" size="large" />;
    }

    return (
      <>
        <Background race={race!} statusMeta={statusMeta!} />
        <Rockets
          refresh={refresh}
          rockets={race?.rockets || []}
          maxRockets={race?.configSnapshot.maxRockets || 0}
          canTx={!statusMeta?.revealBlockReached}
          move={!statusMeta?.waiting}
          winner={statusMeta?.done ? race?.winner : undefined}
        />
        <PreRace show={statusMeta?.waiting! && !!race?.blastOffTimestamp.eq(0)} race={race!} />
        <LaunchCountdown
          show={statusMeta?.waiting! && !!race?.blastOffTimestamp.gt(0)}
          blastOffTimestamp={race?.blastOffTimestamp!}
        />
        <DestroyAsteroid race={race!} statusMeta={statusMeta!} refresh={refresh} />
        <Winner show={statusMeta?.done!} raceId={race?.id!} rocket={race?.rockets[race!.winner]} />
      </>
    );
  }, [error, loading, race, refresh, statusMeta]);

  return <Container>{content}</Container>;
}

const Container = styled.div`
  width: 100%;
  min-width: 1280px;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
  position: relative;

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export default Race;
