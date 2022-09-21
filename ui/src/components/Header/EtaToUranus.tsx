import { useCallback, useEffect, useMemo, useState } from 'react';
import Countdown from 'react-countdown';
import { Typography } from 'antd';
import styled from 'styled-components';
import cn from 'classnames';

import { useSelectedRace, useTimeToL1Block } from '../../hooks';
import { orange } from '../../colors';
import { FINAL_APPROACH_SECONDS, SECOND_MILLIS } from '../../constants';

interface IProps {
  className?: string;
}

const finalApproachMillis = FINAL_APPROACH_SECONDS * SECOND_MILLIS * 0.8;

function EtaToUranus({ className }: IProps) {
  const { loading: raceLoading, race, statusMeta } = useSelectedRace();
  const {
    loading: timeLoading,
    timestamp: blockTimestamp,
    timeLeft: timeToBlock,
  } = useTimeToL1Block(race?.revealBlock!);
  const [showFinalApproach, setShowFinalApproach] = useState(false);
  const loading = raceLoading || timeLoading;
  const hidden = loading || !race || statusMeta?.waiting;
  const timeUnknown = statusMeta?.revealBlockReached && !statusMeta?.done;

  const timeLeft = useMemo(() => {
    if (statusMeta?.waiting) {
      return 0;
    }
    if (showFinalApproach && statusMeta?.done) {
      return finalApproachMillis;
    }
    return timeToBlock + finalApproachMillis;
  }, [showFinalApproach, statusMeta?.done, statusMeta?.waiting, timeToBlock]);

  const timestamp = useMemo(() => {
    if (statusMeta?.waiting) {
      return 0;
    }
    if (showFinalApproach && statusMeta?.done) {
      return Date.now() + finalApproachMillis;
    }
    return blockTimestamp + finalApproachMillis;
  }, [blockTimestamp, showFinalApproach, statusMeta?.done, statusMeta?.waiting]);

  useEffect(() => {
    if (!loading && !statusMeta?.done) {
      setShowFinalApproach(true);
    }
  }, [loading, statusMeta?.done]);

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

  return (
    <Container className={cn(className, { hidden })}>
      <div>ETA to Uranus</div>
      <Typography.Title level={4} className="time">
        <Countdown key={timeLeft} date={timestamp || Date.now()} daysInHours renderer={renderer} />
      </Typography.Title>
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
