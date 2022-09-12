// 1.8 billion miles

import styled from 'styled-components';

import { IRaceStatusMeta } from '../../types';
import FinishLine from './FinishLine';
import Grid from './Grid';
import LaunchPad from './LaunchPad';
import Planets from './Planets';
import Uranus from './Uranus';

interface IProps {
  statusMeta: IRaceStatusMeta;
}

function Background({ statusMeta }: IProps) {
  return (
    <Container>
      {!statusMeta?.waiting && <Planets />}
      <Grid move={!statusMeta?.waiting} />
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
