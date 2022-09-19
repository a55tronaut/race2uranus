import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import random from 'lodash/random';
import sortBy from 'lodash/sortBy';

import { Race2Uranus } from '../../types';
import { GAME_LOOP_INTERVAL_SECONDS, SECOND_MILLIS } from '../../constants';
import Rocket from '../Rocket';
import BoostRocket from '../BoostRocket';
import Track from './Track';

interface IProps {
  rockets: Race2Uranus.RocketStructOutput[];
  maxRockets: number;
  canBoost: boolean;
  move: boolean;
  winner?: number;
  refresh: () => Promise<void>;
}
interface IGameRocketProps {
  style?: React.CSSProperties;
  offset?: number;
  position?: number;
}

type GameRocket = Race2Uranus.RocketStructOutput & IGameRocketProps;

const MIN_ROCKET_OFFSET = 10;
const MAX_ROCKET_OFFSET = 60;

const emptyRocket: Partial<Race2Uranus.RocketStructOutput> = {};

function Rockets({ rockets, maxRockets, canBoost, move, winner, refresh }: IProps) {
  const [gameRockets, setGameRockets] = useState<GameRocket[]>([]);

  const updateRocketPositions = useCallback(
    (move: boolean) => {
      const missingRockets = maxRockets - rockets.length;
      const filledRockets = [...rockets, ...new Array(missingRockets).fill(emptyRocket)].map((rocket, index) => ({
        ...rocket,
        id: rocket.id || index,
      }));

      const updatedRockets: GameRocket[] = filledRockets.map((rocket) => {
        let offset = move ? random(MIN_ROCKET_OFFSET, MAX_ROCKET_OFFSET, true) : 0;

        if (rocket.id === winner) {
          offset = MAX_ROCKET_OFFSET + 3;
        }

        return { ...rocket, offset, style: { bottom: `${offset}%` } };
      }, []);

      const sortedRockets = sortBy(updatedRockets, 'offset').reverse();

      sortedRockets.forEach((rocket, index) => {
        const position = index + 1;

        updatedRockets[rocket.id].position = move ? position : 0;
      });

      setGameRockets(updatedRockets);
    },
    [maxRockets, rockets, winner]
  );

  useEffect(() => {
    updateRocketPositions(move);

    if (move) {
      const intervalId = setInterval(
        updateRocketPositions.bind(null, move),
        GAME_LOOP_INTERVAL_SECONDS * SECOND_MILLIS
      );

      return () => clearInterval(intervalId);
    }
  }, [move, updateRocketPositions]);

  return (
    <Container>
      {gameRockets.map((rocket) => (
        <RocketWithTrack key={rocket.id}>
          <Track className="track" position={rocket.position} />
          <RocketWrapper style={rocket.style}>
            <Rocket className="rocket" address={rocket.nft} nftId={rocket.nftId} boostCount={rocket.totalBoosts} />
          </RocketWrapper>
          {rocket.rocketeer && canBoost && <BoostRocket className="boostBtn" rocket={rocket} refresh={refresh} />}
        </RocketWithTrack>
      ))}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  z-index: 2;
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

  .boostBtn {
    position: absolute;
    bottom: 16px;
    left: -13px;
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

export default Rockets;
