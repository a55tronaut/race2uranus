import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Button, Typography, notification } from 'antd';
import { ethers } from 'ethers';

import { useRaceContract } from '../../hooks';
import { formatNumber } from '../../utils';
import { blue } from '../../colors';
import { Race2Uranus } from '../../types';
import ModalFooter from '../ModalFooter';
import MagicAmount from '../MagicAmount';

interface IProps {
  race: Race2Uranus.RaceStructOutput;
  onClose: () => void;
}

function BoostRocketModalContent({ race, onClose }: IProps) {
  const { contract } = useRaceContract();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    try {
      const res = await contract!.functions.finishRace(race!.id);
      await res.wait(1);

      notification.success({
        message: (
          <>
            You've destroyed the asteroid and gained{' '}
            <strong>{formatNumber(Number(ethers.utils.formatEther(race.configSnapshot.revealBounty)))} $MAGIC</strong>!
          </>
        ),
      });

      onClose();
    } catch (e) {
      console.error(e);
      let error = (e as any)?.message || 'Error';
      if (error.includes('execution reverted: Race already finished')) {
        error = 'Too late! Someone else has already destroyed the asteroid and snatched up the prize!';
      }
      notification.error({ message: error });
    } finally {
      setLoading(false);
    }
  }, [contract, onClose, race]);

  return (
    <Container>
      <Typography.Title level={4} className="title">
        Destroy Asteroid
      </Typography.Title>
      <Content>
        <AsteroidContainer>
          <img src="/assets/planet1.svg" alt="Asteroid" className="asteroid" />
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
    filter: grayscale(0.4);
    transform: skew(-10deg);
  }
  .plume {
    position: absolute;
    width: 200px;
    left: -40px;
    top: -70px;
    transform: rotate(-140deg) scaleY(0.7);
    opacity: 0.9;
    filter: grayscale(1);
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
