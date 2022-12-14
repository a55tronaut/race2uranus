import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Typography, notification } from 'antd';
import { ethers } from 'ethers';

import { useRaceContract } from '../../hooks';
import { extractRpcError, formatNumber, howl } from '../../utils';
import { blue } from '../../colors';
import { Race2Uranus } from '../../types';
import ModalFooter from '../ModalFooter';
import MagicAmount from '../MagicAmount';

interface IProps {
  race: Race2Uranus.RaceStructOutput;
  onClose: () => void;
  refresh: () => Promise<void>;
}

function BoostRocketModalContent({ race, onClose, refresh }: IProps) {
  const { contract } = useRaceContract();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    howl('asteroid-fire.mp3').play();

    try {
      const res = await contract!.functions.finishRace(race!.id);
      await res.wait(1);
      await refresh();

      notification.success({
        message: (
          <>
            You've destroyed the asteroid and gained{' '}
            <strong>{formatNumber(Number(ethers.utils.formatEther(race.configSnapshot.revealBounty)))} $MAGIC</strong>!
          </>
        ),
      });
      howl('asteroid-success.mp3').play();

      onClose();
    } catch (e) {
      console.error(e);
      let message = extractRpcError(e);
      if (message.includes('Race already finished')) {
        message = 'Too late! Someone else has already destroyed the asteroid and snatched up the prize!';
        howl('asteroid-fail.mp3').play();
        onClose();
      }
      notification.error({ message });
    } finally {
      setLoading(false);
    }
  }, [contract, onClose, race, refresh]);

  useEffect(() => {
    howl('asteroid-danger.mp3').play();
  }, []);

  return (
    <Container>
      <Typography.Title level={4} className="title">
        Destroy Asteroid
      </Typography.Title>
      <Content>
        <AsteroidContainer>
          <img src="/assets/asteroid.svg" alt="Asteroid" className="asteroid" />
          <img src="/assets/boost.svg" alt="Plume" className="plume" />
        </AsteroidContainer>
        <DetailsContainer>
          Oh no! There's an asteroid in the way! We need to destroy it to get to our destination!
          <br />
          <br />
          Our scans indicate that the asteroid contains valuable resources! Destroy it first to gain
          <br />
          <div className="amount">
            <MagicAmount withName amount={race!.configSnapshot.revealBounty} />
          </div>
        </DetailsContainer>
      </Content>
      <ModalFooter>
        <Button key="enter" loading={loading} type="primary" size="middle" ghost onClick={handleSubmit}>
          Fire!
        </Button>
      </ModalFooter>
    </Container>
  );
}

const Container = styled.div`
  padding-top: 24px;

  .title {
    color: ${blue};
    text-align: center;
    margin-bottom: 24px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  padding: 24px;
`;

const AsteroidContainer = styled.div`
  position: relative;
  width: 150px;

  .asteroid {
    width: 120px;
    transform: skew(-10deg) rotate(45deg);
  }
  .plume {
    position: absolute;
    width: 200px;
    left: -40px;
    top: -70px;
    transform: rotate(-140deg) scaleY(0.7);
    opacity: 0.8;
    filter: grayscale(0.7);
  }
`;

const DetailsContainer = styled.div`
  margin-left: 48px;

  .amount {
    text-align: center;
    margin-top: 8px;
  }
`;

export default BoostRocketModalContent;
