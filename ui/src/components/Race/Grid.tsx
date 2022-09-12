import styled from 'styled-components';
import cn from 'classnames';

interface IProps {
  move: boolean;
}

function Grid({ move }: IProps) {
  const classNames = cn({ move });

  return <Container className={classNames} />;
}

const Container = styled.div`
  width: 1280px;
  height: 200%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  background: url('/assets/grid.svg') repeat-y;
  opacity: 0.2;

  &.move {
    animation: slide 0.2s linear infinite;
  }

  @keyframes slide {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(0, 80px, 0);
    }
  }
`;

export default Grid;
