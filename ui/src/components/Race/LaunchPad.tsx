import styled from 'styled-components';
import cn from 'classnames';

import { GAME_LOOP_INTERVAL_SECONDS } from '../../constants';

interface IProps {
  show: boolean;
  move: boolean;
}

function LaunchPad({ show, move }: IProps) {
  const classNames = cn({ show, move });

  return (
    <Container className={classNames}>
      <div className="grad2" />
      <div className="grad1" />
      <img alt="Base" className="baseImg" src="/assets/base.svg" />
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  width: 1920px;
  height: 445px;
  z-index: 1;
  right: 50%;
  left: 50%;
  transform: translate(-50%, 0);
  opacity: 0;
  transition: bottom ${GAME_LOOP_INTERVAL_SECONDS}s ease-in-out;

  &.show {
    opacity: 1;
    bottom: 0;
  }

  &.move {
    opacity: 1;
    bottom: -400%;
  }

  .baseImg {
    width: 100%;
  }

  .grad1 {
    height: 10px;
    width: 100%;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
    position: absolute;
    bottom: 50px;
    z-index: 1;
  }

  .grad2 {
    height: 60px;
    width: 100%;
    background-image: linear-gradient(to right, rgba(97, 0, 125, 1), rgba(41, 0, 87, 1));
    position: absolute;
    bottom: 0;
    z-index: 1;
  }
`;

export default LaunchPad;
