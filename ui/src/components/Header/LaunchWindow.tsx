import { useCallback, useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { notification, Typography } from 'antd';
import styled from 'styled-components';
import moment from 'moment-timezone';

import { useRaceTimeParams } from '../../hooks';
import { orange } from '../../colors';
import { DAY_MILLIS, SECOND_MILLIS } from '../../constants';

interface IProps {
  className?: string;
}

function LaunchWindow({ className }: IProps) {
  const { params } = useRaceTimeParams();
  const [timestamp, setTimestamp] = useState<number>();
  const loading = !params;

  useEffect(() => {
    if (!params) {
      return;
    }

    let timeoutId: NodeJS.Timer;

    updateTimestamp();

    function updateTimestamp(notify?: boolean) {
      const closestTimestamp = findClosestTimestamp(params?.blastOffTimes!);
      const diff = closestTimestamp - Date.now();

      setTimestamp(closestTimestamp);

      if (notify) {
        notification.info({
          message: `Launch window missed! Next opportunity ${moment(closestTimestamp).fromNow()}!`,
        });
      }

      timeoutId = setTimeout(() => updateTimestamp(true), diff + 100);
    }

    return () => clearTimeout(timeoutId);
  }, [params]);

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
      <div>Launch Window In</div>
      {!loading && (
        <Typography.Title level={4} className="time">
          <Countdown key={timestamp} date={timestamp} renderer={renderer} />
        </Typography.Title>
      )}
    </Container>
  );
}

function findClosestTimestamp(timesOfDay: number[]): number {
  const now = moment().tz('UTC').toDate().getTime();
  const startOfDay = moment().tz('UTC').startOf('day').toDate().getTime();
  const secondsSinceMidnight = Math.ceil((now - startOfDay) / SECOND_MILLIS);
  const daySeconds = DAY_MILLIS / SECOND_MILLIS;

  let closestTimeOfDay = timesOfDay[0] + daySeconds;

  for (const timeOfDay of timesOfDay) {
    if (timeOfDay > secondsSinceMidnight) {
      closestTimeOfDay = timeOfDay;
      break;
    }
  }

  return moment(startOfDay).add(closestTimeOfDay, 'seconds').toDate().getTime();
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

export default LaunchWindow;
