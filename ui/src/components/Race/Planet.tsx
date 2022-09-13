import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { GAME_LOOP_INTERVAL_SECONDS } from '../../constants';
import { runAfterRender } from '../../utils';

export interface IProps {
  id: string;
  src: string;
  startY: number;
  endY: number;
  x: number;
  size: number;
  rotation: number;
}

function Planet({ id, src, startY, endY, x, size, rotation }: IProps) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const newStyle: React.CSSProperties = {
      visibility: 'visible',
      top: `${startY}%`,
      left: `${x}%`,
      width: `${size}px`,
      transform: `rotate(${rotation}deg)`,
    };

    setStyle(newStyle);

    runAfterRender(() => {
      setStyle({
        ...newStyle,
        top: `${endY}%`,
      });
    });
  }, [endY, rotation, size, startY, x]);

  return <Container key={id} src={src} style={style} />;
}

const Container = styled.img`
  position: absolute;
  transition: all ${GAME_LOOP_INTERVAL_SECONDS * 3}s linear;
  visibility: hidden;
`;

export default Planet;
