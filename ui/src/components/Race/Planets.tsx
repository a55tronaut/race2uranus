import { useCallback, useEffect, useState } from 'react';
import random from 'lodash/random';

import { PLANETS_LOOP_INTERVAL_SECONDS, SECOND_MILLIS } from '../../constants';
import Planet, { IProps as IPlanetProps } from './Planet';

interface IPlanet extends IPlanetProps {
  id: number;
}

const planetPaths = [`/assets/planet1.svg`, `/assets/planet2.svg`, `/assets/planet3.svg`];

let planetCounter = 0;

function Planets() {
  const [planets, setPlanets] = useState<IPlanet[]>([]);

  const updatePlanets = useCallback(() => {
    const newPlanets: IPlanet[] = [];

    for (const src of planetPaths) {
      const numOfPlanets = random(0, 1);

      for (let i = 0; i < numOfPlanets; i++) {
        newPlanets.push({
          id: planetCounter++,
          src,
          startY: random(-150, -20),
          endY: random(130, 250),
          x: random(-5, 100),
          size: random(25, 150),
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
    <>
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
    </>
  );
}

export default Planets;
