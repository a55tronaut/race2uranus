import { useCallback, useMemo } from 'react';
import Countdown from 'react-countdown';
import { Typography } from 'antd';
import styled from 'styled-components';

import { useRaceMetaWitness, useSelectedRace, useTimeToL1Block } from '../../hooks';
import { orange } from '../../colors';
import { FINAL_APPROACH_SECONDS, SECOND_MILLIS } from '../../constants';

interface IProps {
  className?: string;
}

const finalApproachMillis = FINAL_APPROACH_SECONDS * SECOND_MILLIS * 0.8;

function EtaToUranus({ className }: IProps) {
  const { loading: raceLoading, race, statusMeta } = useSelectedRace();
  const { seenPreDone } = useRaceMetaWitness(statusMeta);
  const {
    loading: timeLoading,
    timestamp: blockTimestamp,
    timeLeft: timeToBlock,
  } = useTimeToL1Block(race?.revealBlock!);
  const loading = raceLoading || timeLoading;
  const timeUnknown = statusMeta?.revealBlockReached && !statusMeta?.done;

  const timeLeft = useMemo(() => {
    if (statusMeta?.waiting) {
      return 0;
    }
    return timeToBlock + finalApproachMillis;
  }, [statusMeta?.waiting, timeToBlock]);

  const timestamp = useMemo(() => {
    if (statusMeta?.waiting) {
      return 0;
    }
    return blockTimestamp + finalApproachMillis;
  }, [blockTimestamp, statusMeta?.waiting]);

  const finalApproachTimestamp = useMemo(() => {
    if (statusMeta?.done && seenPreDone) {
      return Date.now() + finalApproachMillis;
    }

    return Date.now();
  }, [seenPreDone, statusMeta?.done]);

  const renderer = useCallback(
    ({
      hours,
      formatted,
      completed,
    }: {
      hours: number;
      minutes: number;
      seconds: number;
      formatted: {
        hours: string;
        minutes: string;
        seconds: string;
      };
      milliseconds: number;
      completed: boolean;
    }) => {
      if (timeUnknown) {
        return '???';
      }
      if (completed) {
        return '-';
      }
      let formattedTime = `${formatted.minutes}:${formatted.seconds}`;
      if (hours) {
        formattedTime = `${formatted.hours}:${formattedTime}`;
      }
      return formattedTime;
    },
    [timeUnknown]
  );

  const finalRenderer = useCallback(
    ({
      hours,
      formatted,
      completed,
    }: {
      hours: number;
      minutes: number;
      seconds: number;
      formatted: {
        hours: string;
        minutes: string;
        seconds: string;
      };
      milliseconds: number;
      completed: boolean;
    }) => {
      if (completed) {
        return '-';
      }
      let formattedTime = `${formatted.minutes}:${formatted.seconds}`;
      if (hours) {
        formattedTime = `${formatted.hours}:${formattedTime}`;
      }
      return formattedTime;
    },
    []
  );

  return (
    <Container className={className}>
      <div>ETA to Uranus</div>
      {!loading && (
        <Typography.Title level={4} className="time">
          {statusMeta?.done ? (
            <Countdown key="finalCountdown" date={finalApproachTimestamp} renderer={finalRenderer} />
          ) : (
            <Countdown key={timeLeft} date={timestamp || Date.now()} daysInHours renderer={renderer} />
          )}
        </Typography.Title>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 130px;

  .hidden {
    visibility: hidden;
  }

  .time.time {
    color: ${orange};
    margin: 0;
  }
`;

export default EtaToUranus;
