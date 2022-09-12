import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Button, Typography, notification, Alert } from 'antd';

import { useRaceContract, useEnsureMagicApproval, useSelectedRace } from '../../hooks';
import { getNftConfig } from '../../utils';
import { blue } from '../../colors';
import { Race2Uranus } from '../../types';
import Rocket from '../Rocket';
import ModalFooter from '../ModalFooter';
import MagicAmount from '../MagicAmount';

interface IProps {
  rocket: Race2Uranus.RocketStructOutput;
  onClose: () => void;
}

function BoostRocketModalContent({ rocket, onClose }: IProps) {
  const { race } = useSelectedRace();
  const { contract } = useRaceContract();
  const { ensureApproval } = useEnsureMagicApproval();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    try {
      await ensureApproval(race!.configSnapshot.boostPrice);
      const res = await contract.functions!.applyBoost(race!.id, rocket.id);
      await res.wait(1);

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
  }, [contract.functions, ensureApproval, onClose, race, rocket.id, rocket.nft, rocket.nftId]);

  return (
    <Container>
      <Typography.Title level={4} className="title">
        Boost Rocket
      </Typography.Title>
      <Content>
        <RocketContainer>
          <Rocket className="rocket" address={rocket.nft} nftId={rocket.nftId!} />
        </RocketContainer>
        <DetailsContainer>
          <Alert
            type="info"
            message={
              <>
                Boost the rocket's propulsion systems with a bit of <strong>$MAGIC</strong>! The substance is inherently
                unstable so it may speed up the rocket but it can also slow it down!
              </>
            }
          />
          <PriceContainer>
            Boost price: <MagicAmount withName amount={race!.configSnapshot.boostPrice!} />
          </PriceContainer>
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

const RocketContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 0;

  .rocket {
    width: 80px;
  }
`;

const DetailsContainer = styled.div`
  margin-left: 48px;
`;

const PriceContainer = styled.div`
  margin-top: 48px;
`;

export default BoostRocketModalContent;
