import styled from 'styled-components';

import { PreRace } from './PreRace';
import Tracks from './Tracks';
import Planets from './Planets';
import Base from './Base';

function Game() {
  return (
    <Wrapper>
      <Base />
      <Layout>
        <Planets />
        <Grid />
        <PreRace />
        <Tracks />
      </Layout>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-image: url(../assets/background.svg);
  width: 100vw;
  height: 100vh;
  background-position: center top;
  background-size: cover;
  background-repeat: no-repeat;
  position: fixed;
`;

const Grid = styled.div`
  background-image: url(../assets/grid.svg);
  width: 1280px;
  height: 100vh;
  position: absolute;
  background-position: center top;
  background-repeat: repeat-y;
  margin: 0 auto;
  opacity: 0.15;
`;

const Layout = styled.div`
  max-width: 1280px;
  margin: 0px auto;
`;

export default Game;
