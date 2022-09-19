import styled from 'styled-components';
import cn from 'classnames';

import { FINAL_APPROACH_SECONDS } from '../../constants';

interface IProps {
  move: boolean;
}

function FinishLine({ move }: IProps) {
  const classNames = cn({ move });

  return <Container className={classNames} />;
}

const Container = styled.div`
  position: absolute;
  width: 120vw;
  height: 50px;
  left: 50%;
  top: -400vh;
  transform: translate(-50%, 0) skew(-15deg);
  opacity: 0.2;
  z-index: 2;
  transition: top ${FINAL_APPROACH_SECONDS}s linear;
  background-image: url(/assets/checkered-flag.svg);
  background-position: center;
  background-size: contain;
  background-repeat: repeat-x;
  background-attachment: fixed;

  &.move {
    top: 100vh;
  }
`;

export default FinishLine;
