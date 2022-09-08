import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import random from 'lodash/random';
import sortBy from 'lodash/sortBy';

import { useSelectedRace } from '../../hooks';
import { Race2Uranus } from '../../types';
import { GAME_LOOP_INTERVAL_SECONDS, SECOND_MILLIS } from '../../constants';
import Rocket from '../Rocket';
import Track from './Track';

interface IGameRocketProps {
  style?: React.CSSProperties;
  offset?: number;
  position?: number;
  classNames?: string;
}

type GameRocket = Race2Uranus.RocketStructOutput & IGameRocketProps;

const MIN_ROCKET_OFFSET = 0;
const MAX_ROCKET_OFFSET = 70;

function Game() {
  const race = useSelectedRace();
  const [rockets, setRockets] = useState<GameRocket[]>([]);

  // useEffect(() => {
  //   if (race.rockets) {
  //     setRockets(race.rockets as any);
  //   }
  // }, [race.rockets]);

  const updateRocketPositions = useCallback(() => {
    if (race.rockets) {
      const updatedRockets: GameRocket[] = race.rockets.map((rocket) => {
        const offset = random(MIN_ROCKET_OFFSET, MAX_ROCKET_OFFSET, true);

        return { ...rocket, offset, style: { bottom: `${offset}%` } };
      }, []);

      const sortedRockets = sortBy(updatedRockets, 'offset').reverse();

      sortedRockets.forEach((rocket, index) => {
        const position = index + 1;

        updatedRockets[rocket.id].position = position;
      });

      setRockets(updatedRockets);
    }
  }, [race.rockets]);

  useEffect(() => {
    updateRocketPositions();
    const intervalId = setInterval(updateRocketPositions, GAME_LOOP_INTERVAL_SECONDS * SECOND_MILLIS);

    return () => clearInterval(intervalId);
  }, [updateRocketPositions]);

  return (
    <Container>
      <Rockets>
        {rockets.map((rocket) => (
          <RocketWithTrack key={rocket.id}>
            <Track className="track" position={rocket.position} />
            <RocketWrapper style={rocket.style}>
              <Rocket className="rocket" address={rocket.nft} nftId={rocket.nftId} />
            </RocketWrapper>
          </RocketWithTrack>
        ))}
      </Rockets>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  min-width: 960px;
  height: 100vh;
  min-height: 600px;
  background-image: url(../assets/background.svg);
  background-position: center top;
  background-size: cover;
  background-repeat: no-repeat;
  position: fixed;
`;

const Rockets = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const RocketWithTrack = styled.div`
  margin-left: 36px;
  margin-right: 36px;
  position: relative;
  width: 80px;

  .track {
    position: absolute;
    bottom: 0;
    left: -20px;
  }
`;

const RocketWrapper = styled.div`
  position: absolute;
  bottom: 0%;
  transition: all ${GAME_LOOP_INTERVAL_SECONDS}s ease-in-out;

  .rocket {
    width: 80px;
  }
`;

const Grid = styled.div`
  background-image: url(../assets/grid.svg);
  width: 1280px;
  height: 100vh;
  position: absolute;
  background-position: center top;
  background-repeat: repeat-y;
  margin: 0 auto;
  opacity: 0.15;
`;

export default Game;
