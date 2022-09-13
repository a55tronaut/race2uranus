import styled from 'styled-components';

import { useSelectedRace } from '../../hooks';
import Background from './Background';
import PreRace from './PreRace';
import LaunchCountdown from './LaunchCountdown';
import Rockets from './Rockets';
import Winner from './Winner';
import { Spin } from 'antd';

function Race() {
  const { race, statusMeta, loading } = useSelectedRace();

  return (
    <Container>
      {loading ? (
        <Spin className="loader" size="large" />
      ) : (
        <>
          <Background statusMeta={statusMeta!} />
          <Rockets
            rockets={race?.rockets || []}
            maxRockets={race?.configSnapshot.maxRockets || 0}
            move={!statusMeta?.waiting}
            winner={statusMeta?.done ? race?.winner : undefined}
          />
          <PreRace show={statusMeta?.waiting! && !!race?.blastOffTimestamp.eq(0)} rewardPool={race?.rewardPool!} />
          <LaunchCountdown
            show={statusMeta?.waiting! && !!race?.blastOffTimestamp.gt(0)}
            blastOffTimestamp={race?.blastOffTimestamp!}
          />
          {statusMeta?.done && <Winner rocket={race!.rockets[race!.winner]} />}
        </>
      )}
    </Container>
  );
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
