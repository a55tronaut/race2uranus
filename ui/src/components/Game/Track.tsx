import styled from 'styled-components';
import cn from 'classnames';

import { GAME_LOOP_INTERVAL_SECONDS } from '../../constants';

interface IProps {
  className?: string;
  position?: number;
}

const classNameForPosition: { [key: number]: string } = {
  1: 'first',
  2: 'second',
  3: 'third',
};

function Track({ className, position }: IProps) {
  const classNames = cn(className, classNameForPosition[position!]);
  return <Container className={classNames} />;
}

const Container = styled.div`
  height: 50vh;
  width: 120px;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1));
  filter: invert(0);
  margin: auto auto 0;
  transition: all ${GAME_LOOP_INTERVAL_SECONDS}s ease-in-out;

  &.first {
    // #009bff https://codepen.io/sosuke/pen/Pjoqqp
    filter: invert(100%) invert(45%) sepia(47%) saturate(4452%) hue-rotate(182deg) brightness(103%) contrast(105%)
      saturate(200%);
  }
  &.second {
    // #a400aa
    filter: invert(100%) invert(13%) sepia(87%) saturate(6168%) hue-rotate(294deg) brightness(79%) contrast(107%)
      saturate(200%);
  }
  &.third {
    // #6000c6
    filter: invert(100%) invert(14%) sepia(81%) saturate(4462%) hue-rotate(269deg) brightness(82%) contrast(137%)
      saturate(200%);
  }
`;

export default Track;
