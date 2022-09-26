import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Button, Typography, notification, Alert } from 'antd';

import { useRaceContract, useEnsureMagicApproval, useSelectedRace } from '../../hooks';
import { blue } from '../../colors';
import { Race2Uranus } from '../../types';
import { extractRpcError } from '../../utils';
import Rocket from '../Rocket';
import ModalFooter from '../ModalFooter';
import MagicAmount from '../MagicAmount';
import NftName from '../NftName';

interface IProps {
  rocket: Race2Uranus.RocketStructOutput;
  onClose: () => void;
  refresh: () => Promise<void>;
}

function BoostRocketModalContent({ rocket, onClose, refresh }: IProps) {
  const { race } = useSelectedRace();
  const { contract } = useRaceContract();
  const { ensureApproval } = useEnsureMagicApproval();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    try {
      await ensureApproval(race!.configSnapshot.boostPrice);
      const res = await contract!.functions.applyBoost(race!.id, rocket.id);
      await res.wait(1);
      await refresh();

      notification.success({
        message: (
          <>
            You've boosted the rocket occupied by{' '}
            <strong>
              <NftName address={rocket.nft} id={rocket.nftId} />
            </strong>
            !
          </>
        ),
      });

      onClose();
    } catch (e) {
      console.error(e);
      const message = extractRpcError(e);
      notification.error({ message });
    } finally {
      setLoading(false);
    }
  }, [contract, ensureApproval, onClose, race, refresh, rocket.id, rocket.nft, rocket.nftId]);

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
            showIcon
            message={
              <>
                Any rocket can be boosted by anyone at any point during the race. Boosting affects the chances of the
                rocket winning the race.
              </>
            }
          />
          <br />
          <div>
            Boost the rocket's propulsion systems with a bit of <strong>$MAGIC</strong>! The substance is inherently
            unstable so its full effects will not be known until the end of the race - it may speed up the rocket but it
            can also slow it down!
            <br />
            You can only boost a rocket up to <strong>3</strong> times!
          </div>
          <PriceContainer>
            Boost price: <MagicAmount withName duration={0} amount={race!.configSnapshot.boostPrice!} />
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
  align-items: center;
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
