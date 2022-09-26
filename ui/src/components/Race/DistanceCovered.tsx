import { Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import cn from 'classnames';

import { GAME_LOOP_INTERVAL_SECONDS, SECOND_MILLIS } from '../../constants';
import { useTimeToL1Block } from '../../hooks';
import { Race2Uranus } from '../../types';
import { runAfterRender } from '../../utils';

interface IProps {
  race: Race2Uranus.RaceStructOutput;
}

const MAX_DISTANCE_MILES = 1_980_000_000;

function DistanceCovered({ race }: IProps) {
  const { timestamp: end } = useTimeToL1Block(race?.revealBlock);
  const [distance, setDistance] = useState(0);
  const [animate, setAnimate] = useState(false);

  const updateDistance = useCallback(() => {
    if (!document.hidden) {
      setAnimate(false);
      const start = race?.blastOffTimestamp.toNumber() * 1000;
      const totalTime = end - start;
      const timeElapsed = Date.now() - start;
      const progress = Math.min(timeElapsed / totalTime, 1);
      const _distance = progress * MAX_DISTANCE_MILES;
      setDistance(_distance);
      runAfterRender(() => setAnimate(true));
    }
  }, [end, race?.blastOffTimestamp]);

  useEffect(() => {
    const intervalId = setInterval(updateDistance, 2 * GAME_LOOP_INTERVAL_SECONDS * SECOND_MILLIS);

    return () => clearInterval(intervalId);
  }, [updateDistance]);

  return (
    <Container>
      <Distance key={distance} className={cn({ animate })}>
        <Typography.Title className="text">{nFormatter(distance)} Miles</Typography.Title>
      </Distance>
    </Container>
  );
}

// https://stackoverflow.com/a/9462382
function nFormatter(num: number) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(3).replace(rx, '$1') + ' ' + item.symbol : '0';
}

const Container = styled.div``;

const Distance = styled.div`
  position: absolute;
  top: -30%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.4);
  opacity: 0.25;
  transition: top ${GAME_LOOP_INTERVAL_SECONDS}s linear;

  &.animate {
    top: 130%;
  }

  .text {
    text-transform: uppercase;
    font-weight: bold;
  }
`;

export default DistanceCovered;
