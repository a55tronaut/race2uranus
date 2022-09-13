import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useSelectedRace } from '../../hooks';
import Background from './Background';
import Rockets from './Rockets';
import Winner from './Winner';

function Race() {
  const { race, statusMeta, loading } = useSelectedRace();

  console.log(statusMeta);

  return (
    <Container>
      {loading && <div>loading...</div>}
      <Background statusMeta={statusMeta!} />
      <Rockets
        rockets={race?.rockets || []}
        move={!statusMeta?.waiting}
        winner={statusMeta?.done ? race?.winner : undefined}
      />
      {statusMeta?.done && <Winner rocket={race!.rockets[race!.winner]} />}
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
`;

export default Race;
