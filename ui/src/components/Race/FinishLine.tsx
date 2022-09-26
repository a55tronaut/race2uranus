import styled from 'styled-components';
import cn from 'classnames';

import { FINAL_APPROACH_SECONDS } from '../../constants';

interface IProps {
  move: boolean;
}

function FinishLine({ move }: IProps) {
  const classNames = cn({ move });

  return <Container src="/assets/finish.svg" className={classNames} />;
}

const Container = styled.img`
  position: absolute;
  width: 1280px;
  left: 50%;
  top: -400vh;
  transform: translate(-50%, 0);
  opacity: 0.8;
  z-index: 2;
  transition: top ${FINAL_APPROACH_SECONDS}s linear;

  &.move {
    top: 100vh;
  }
`;

export default FinishLine;
