import { useCallback } from 'react';
import Countdown from 'react-countdown';
import { Typography } from 'antd';
import styled from 'styled-components';

import { useSelectedRace, useTimeToL1Block } from '../../hooks';
import { orange } from '../../colors';

interface IProps {
  className?: string;
}

function EtaToUranus({ className }: IProps) {
  const { loading: raceLoading, race, statusMeta } = useSelectedRace();
  const { loading: timeLoading, timestamp, timeLeft } = useTimeToL1Block(race?.revealBlock!);
  const loading = raceLoading || timeLoading;

  const renderer = useCallback(
    ({
      hours,
      formatted,
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
      <Typography.Title level={4} className="time">
        {loading || !race || statusMeta?.waiting ? (
          '-'
        ) : (
          <Countdown key={timeLeft} date={timestamp || Date.now()} daysInHours renderer={renderer} />
        )}
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

  .time.time {
    color: ${orange};
  }
`;

export default EtaToUranus;
