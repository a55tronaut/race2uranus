import { useCallback, useEffect, useRef, useState } from 'react';
import random from 'lodash/random';

import { GAME_LOOP_INTERVAL_SECONDS, SECOND_MILLIS } from '../../constants';
import Planet, { IProps as IPlanet } from './Planet';

const planetPaths = [`/assets/planet1.svg`, `/assets/planet2.svg`, `/assets/planet3.svg`];

const MIN_SIZE = 25;
const MAX_SIZE = 250;

const MIN_OFFSET = -50;
const MAX_OFFSET = -300;

function Planets() {
  const planets = useRef<IPlanet[]>([]);
  const [planetsToRender, setPlanetsToRender] = useState<IPlanet[]>([]);

  const updatePlanets = useCallback(() => {
    const newPlanets: IPlanet[] = [];

    for (const src of planetPaths) {
      const numOfPlanets = random(0, 1);

      for (let i = 0; i < numOfPlanets; i++) {
        const size = random(25, 250);
        const startY = calcStartPosition(size);
        const endY = -startY + 100;

        newPlanets.push({
          id: `${Date.now()}.${src}.${i}`,
          src,
          startY,
          endY,
          x: random(-5, 100),
          size,
          rotation: random(-359, 359),
        });
      }
    }

    const viewportHeight = window.innerHeight;
    const filteredPlanets = planets.current.filter((planet) => {
      try {
        const elem = document.getElementById(planet.id);
        const { y } = elem?.getBoundingClientRect()!;

        return y < viewportHeight;
      } catch (e) {
        return false;
      }
    });

    const sortedPlanets = [...filteredPlanets, ...newPlanets].sort((a, b) => a.size - b.size);
    planets.current = sortedPlanets;

    setPlanetsToRender(sortedPlanets);
  }, []);

  useEffect(() => {
    updatePlanets();
    const intervalId = setInterval(updatePlanets, GAME_LOOP_INTERVAL_SECONDS * SECOND_MILLIS);

    return () => clearInterval(intervalId);
  }, [updatePlanets]);

  return (
    <>
      {planetsToRender.map((planet) => (
        <Planet
          key={planet.id}
          id={planet.id}
          src={planet.src}
          startY={planet.startY}
          endY={planet.endY}
          x={planet.x}
          size={planet.size}
          rotation={planet.rotation}
        />
      ))}
    </>
  );
}

function calcStartPosition(size: number): number {
  const minSizeDiff = 0 - MIN_SIZE;
  const normalizedMaxSize = MAX_SIZE - minSizeDiff;
  const proportionalSize = (size - minSizeDiff) / normalizedMaxSize;
  const offsetDiff = MAX_OFFSET - MIN_OFFSET;

  return MIN_OFFSET + proportionalSize * offsetDiff;
}

export default Planets;
