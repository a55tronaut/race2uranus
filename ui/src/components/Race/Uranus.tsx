import styled from 'styled-components';
import cn from 'classnames';

import { FINAL_APPROACH_SECONDS } from '../../constants';

interface IProps {
  move: boolean;
}

function Uranus({ move }: IProps) {
  const classNames = cn({ move });

  return <Img className={classNames} src="/assets/uranus-ring.svg" />;
}

const Img = styled.img`
  position: absolute;
  width: 250vw;
  left: 50%;
  top: -400vw;
  transform: translate(-50%, 0);
  opacity: 1;
  z-index: 1;
  transition: top ${FINAL_APPROACH_SECONDS}s linear;

  &.move {
    opacity: 1;
    top: -100vw;
  }
`;

export default Uranus;
