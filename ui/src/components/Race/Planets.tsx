import { useCallback, useEffect, useRef, useState } from 'react';
import random from 'lodash/random';

import { GAME_LOOP_INTERVAL_SECONDS, SECOND_MILLIS } from '../../constants';
import Planet, { IProps as IPlanet } from './Planet';

const planetPaths = [
  `/assets/planet1.svg`,
  `/assets/planet2.svg`,
  `/assets/planet3.svg`,
  `/assets/planet4.svg`,
  `/assets/planet5.svg`,
  `/assets/planet6.svg`,
  `/assets/planet7.svg`,
];

const MIN_SIZE = 25;
const MAX_SIZE = 250;
const SIZE_DIFF = MAX_SIZE - MIN_SIZE;

const MIN_DISTANCE = 300;
const MAX_DISTANCE = 800;
const SCREEN_DISTANCE = 150;

function Planets() {
  const planets = useRef<IPlanet[]>([]);
  const [planetsToRender, setPlanetsToRender] = useState<IPlanet[]>([]);

  const updatePlanets = useCallback(() => {
    const newPlanets: IPlanet[] = [];

    if (!document.hidden) {
      const numPlanets = random(0, 2);
      let availablePlanets = planetPaths;
      const numSizes = numPlanets + random(2, 7);
      const sizeIncrement = SIZE_DIFF / numSizes;
      let availableSizes = new Array(numSizes).fill(null).map((_, i) => MIN_SIZE + sizeIncrement * i);
      for (let i = 0; i < numPlanets; i++) {
        const [src, remainingPlanets] = extractRandomArrayItem(availablePlanets);
        availablePlanets = remainingPlanets;
        const [size, remainingSizes] = extractRandomArrayItem(availableSizes);
        availableSizes = remainingSizes;
        const totalDistance = calcDistanceToCover(size);
        const availableDistance = (totalDistance - SCREEN_DISTANCE) / 2;
        const startY = random(-availableDistance, -25);
        const endY = startY + totalDistance;

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

function calcDistanceToCover(size: number): number {
  const minSizeDiff = 0 - MIN_SIZE;
  const normalizedMaxSize = MAX_SIZE - minSizeDiff;
  const proportionalSize = (size - minSizeDiff) / normalizedMaxSize;
  const distanceDiff = MAX_DISTANCE - MIN_DISTANCE;

  return MIN_DISTANCE + proportionalSize * distanceDiff;
}

function extractRandomArrayItem<T>(arr: T[]): [T, T[]] {
  const index = random(0, arr.length - 1);
  const item = arr[index];
  const remainder = arr.filter((_, i) => i !== index);

  return [item, remainder];
}

export default Planets;
