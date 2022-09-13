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
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4));
  filter: opacity(25%);
  margin: auto auto 0;
  transition: all ${GAME_LOOP_INTERVAL_SECONDS}s ease-in-out;

  &.first {
    // #ffd600 https://codepen.io/sosuke/pen/Pjoqqp
    filter: opacity(100%) invert(100%) invert(73%) sepia(59%) saturate(790%) hue-rotate(0deg) brightness(105%)
      contrast(105%);
  }
  &.second {
    // #a400aa
    filter: opacity(100%) invert(100%) invert(14%) sepia(95%) saturate(5542%) hue-rotate(294deg) brightness(78%)
      contrast(109%);
  }
  &.third {
    // #6000c6
    filter: opacity(100%) invert(100%) invert(14%) sepia(81%) saturate(4462%) hue-rotate(269deg) brightness(82%)
      contrast(137%) saturate(200%);
  }
`;

export default Track;
