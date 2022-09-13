import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import Countdown from 'react-countdown';
import { BigNumber } from 'ethers';
import { Typography } from 'antd';

interface IProps {
  show: boolean;
  blastOffTimestamp: BigNumber;
}

function LaunchCountdown({ show, blastOffTimestamp }: IProps) {
  const timestampMillis = useMemo(() => {
    if (blastOffTimestamp?.gt(0)) {
      return blastOffTimestamp.toNumber() * 1000;
    }
  }, [blastOffTimestamp]);

  const renderer = useCallback(
    ({
      hours,
      formatted,
      milliseconds,
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
        return (
          <Typography.Title className="liftoff" level={1}>
            Liftoff!
          </Typography.Title>
        );
      } else {
        let formattedTime = `${formatted.minutes}:${formatted.seconds}`;
        if (hours) {
          formattedTime = `${formatted.hours}:${formattedTime}`;
        }

        return (
          <Timer>
            <Typography.Title level={5} className="launch">
              Launch in
            </Typography.Title>
            <div className="time">
              <Typography.Title className="hms" level={1}>
                {formattedTime}
              </Typography.Title>
              <span className="millis">{milliseconds}</span>
            </div>
          </Timer>
        );
      }
    },
    []
  );

  return (
    <Container>
      <CSSTransition in={show} timeout={500} classNames="launch-countdown" unmountOnExit>
        <div>
          {!!timestampMillis && (
            <Countdown date={timestampMillis} daysInHours intervalDelay={0} precision={3} renderer={renderer} />
          )}
        </div>
      </CSSTransition>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;

  .launch-countdown-enter {
    opacity: 0;
  }
  .launch-countdown-enter-active {
    opacity: 1;
    transition: opacity 0.5s ease;
  }
  .launch-countdown-enter-done {
    opacity: 1;
  }
  .launch-countdown-exit {
    opacity: 1;
  }
  .launch-countdown-exit-active {
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .launch-countdown-exit-done {
    opacity: 0;
  }
`;

const Timer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .launch {
    margin-bottom: 12px;
  }

  .time {
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }

  .hms {
    min-width: 135px;
  }

  .millis {
    display: inline-block;
    width: 30px;
    margin-left: 8px;
  }
`;

export default LaunchCountdown;
