// 1.8 billion miles

import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import random from 'lodash/random';

import { PLANETS_LOOP_INTERVAL_SECONDS, SECOND_MILLIS } from '../../constants';
import Planet, { IProps as IPlanetProps } from './Planet';

interface IPlanet extends IPlanetProps {
  id: number;
}

const planetPaths = [`/assets/planet1.svg`, `/assets/planet2.svg`, `/assets/planet3.svg`];

let planetCounter = 0;

function Background() {
  const [planets, setPlanets] = useState<IPlanet[]>([]);

  const updatePlanets = useCallback(() => {
    const newPlanets: IPlanet[] = [];

    for (const src of planetPaths) {
      const numOfPlanets = random(0, 1);

      for (let i = 0; i < numOfPlanets; i++) {
        newPlanets.push({
          id: planetCounter++,
          src,
          startY: random(-200, -20),
          endY: random(120, 200),
          x: random(-10, 110),
          size: random(30, 150),
          rotation: random(0, 359),
        });
      }
    }

    setPlanets(newPlanets);
  }, []);

  useEffect(() => {
    updatePlanets();
    const intervalId = setInterval(updatePlanets, PLANETS_LOOP_INTERVAL_SECONDS * SECOND_MILLIS);

    return () => clearInterval(intervalId);
  }, [updatePlanets]);

  return (
    <Container>
      {planets.map((planet) => (
        <Planet
          key={planet.id}
          src={planet.src}
          startY={planet.startY}
          endY={planet.endY}
          x={planet.x}
          size={planet.size}
          rotation={planet.rotation}
        />
      ))}

      <Grid />
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

const Grid = styled.div`
  width: 1280px;
  height: 200%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  background: url('/assets/grid.svg') repeat-y;
  opacity: 0.2;
  animation: slide 0.2s linear infinite;

  @keyframes slide {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(0, 80px, 0);
    }
  }
`;

export default Background;
