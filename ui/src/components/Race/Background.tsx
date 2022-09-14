import styled from 'styled-components';

import { IRaceStatusMeta, Race2Uranus } from '../../types';
import DistanceCovered from './DistanceCovered';
import FinishLine from './FinishLine';
import Grid from './Grid';
import LaunchPad from './LaunchPad';
import Planets from './Planets';
import Uranus from './Uranus';

interface IProps {
  race: Race2Uranus.RaceStructOutput;
  statusMeta: IRaceStatusMeta;
}

function Background({ race, statusMeta }: IProps) {
  return (
    <Container>
      {!statusMeta?.waiting && <Planets />}
      <Grid move={!statusMeta?.waiting} />
      {!statusMeta?.waiting && <DistanceCovered race={race} />}
      <LaunchPad show={statusMeta?.waiting!} move={statusMeta?.inProgress!} />
      <FinishLine move={statusMeta?.done!} />
      <Uranus move={statusMeta?.done!} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

export default Background;
