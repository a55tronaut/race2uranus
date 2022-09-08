import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { Button, Typography, notification } from 'antd';

import { useRaceContract, useEnsureMagicApproval, useSelectedRace } from '../../hooks';
import { getNftConfig } from '../../utils';
import { blue } from '../../colors';
import { Race2Uranus } from '../../types';
import Rocket from '../Rocket';
import ModalFooter from '../ModalFooter';

interface IProps {
  rocket: Race2Uranus.RocketStructOutput;
  onClose: () => void;
}

function BoostRocketModalContent({ rocket, onClose }: IProps) {
  const race = useSelectedRace();
  const { contract } = useRaceContract();
  const { ensureApproval } = useEnsureMagicApproval();
  const [loading, setLoading] = useState(false);

  const boostPrice = useMemo(() => {
    return Number(ethers.utils.formatEther(race.configSnapshot?.boostPrice!));
  }, [race.configSnapshot?.boostPrice]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    try {
      await ensureApproval(race.configSnapshot!.boostPrice);
      await contract.functions!.applyBoost(race.id!, rocket.id);

      const nftConfig = getNftConfig(rocket.nft);

      notification.success({
        message: (
          <>
            You've boosted the rocket occupied by{' '}
            <strong>
              {nftConfig.name} #{rocket.nftId.toString()}
            </strong>
            !
          </>
        ),
      });

      onClose();
    } catch (e) {
      console.error(e);
      const error = (e as any)?.message || 'Error';
      notification.error({ message: error });
    } finally {
      setLoading(false);
    }
  }, [contract.functions, ensureApproval, onClose, race.configSnapshot, race.id, rocket.id, rocket.nft, rocket.nftId]);

  return (
    <Container>
      <Content>
        <RocketContainer>
          <Rocket className="rocket" address={rocket.nft} nftId={rocket.nftId!} />
        </RocketContainer>
        <DetailsContainer>
          <Typography.Title level={4} className="title">
            Boost Rocket
          </Typography.Title>
        </DetailsContainer>
      </Content>
      <ModalFooter>
        <Button key="enter" loading={loading} type="primary" size="middle" ghost onClick={handleSubmit}>
          Boost
        </Button>
      </ModalFooter>
    </Container>
  );
}

const Container = styled.div``;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;

  .title {
    color: ${blue};
    text-align: center;
    margin-bottom: 24px;
  }
`;

const RocketContainer = styled.div``;
const DetailsContainer = styled.div``;

export default BoostRocketModalContent;
