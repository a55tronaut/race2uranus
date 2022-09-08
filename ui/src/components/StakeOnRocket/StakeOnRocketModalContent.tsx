import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { Button, Typography, Input, Form, notification } from 'antd';

import { useRaceContract, useEnsureMagicApproval, useSelectedRace } from '../../hooks';
import { formatNumber, getNftConfig } from '../../utils';
import { blue } from '../../colors';
import { Race2Uranus } from '../../types';
import InfoTooltip from '../InfoTooltip';
import RocketPicker from '../RocketPicker';
import ModalFooter from '../ModalFooter';

interface IProps {
  onClose: () => void;
}

function StakeOnRocketModalContent({ onClose }: IProps) {
  const race = useSelectedRace();
  const { contract } = useRaceContract();
  const { ensureApproval } = useEnsureMagicApproval();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRocket, setSelectedRocket] = useState<Race2Uranus.RocketStructOutput>();
  const [stakeAmount, setStakeAmount] = useState<number>();

  const minStake = useMemo(() => {
    return Number(ethers.utils.formatEther(race.configSnapshot?.minStakeAmount!));
  }, [race.configSnapshot?.minStakeAmount]);
  const maxStake = useMemo(() => {
    return Number(ethers.utils.formatEther(race.configSnapshot?.maxStakeAmount!));
  }, [race.configSnapshot?.maxStakeAmount]);

  const handleAmountChange = useCallback((e: any) => {
    setStakeAmount(e.target.value);
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    try {
      await form.validateFields();
      const stakeAmountWei = ethers.utils.parseEther(stakeAmount!.toString());
      await ensureApproval(stakeAmountWei);
      await contract.functions!.stakeOnRocket(race.id!, selectedRocket!.id, stakeAmountWei);

      const nftConfig = getNftConfig(selectedRocket!.nft);

      notification.success({
        message: (
          <>
            You've staked <strong>{formatNumber(stakeAmount!)} $MAGIC</strong> on rocket occupied by{' '}
            <strong>
              {nftConfig.name} #{selectedRocket!.nftId.toString()}
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
  }, [contract.functions, ensureApproval, form, onClose, race.id, selectedRocket, stakeAmount]);

  const rocketPickerLabel = (
    <>
      Choose a rocket{' '}
      <InfoTooltip
        className="infoTooltip"
        message={
          <>If the rocket you picked wins, you will receive a portion of the reward pool proportional to your stake!</>
        }
      />
    </>
  );

  const stakeAmountLabel = (
    <>
      Select amount of $MAGIC to stake{' '}
      <InfoTooltip
        className="infoTooltip"
        message={
          <>
            The $MAGIC you stake will be added to the race reward pool. The more you stake the bigger share of the pool
            you will get if your rocket wins!
          </>
        }
      />
    </>
  );

  return (
    <Container>
      <Content>
        <Typography.Title level={4} className="title">
          Stake on a rocket
        </Typography.Title>
        <Form layout="vertical" form={form}>
          <Form.Item
            name="rocket"
            label={rocketPickerLabel}
            validateFirst
            rules={[{ required: true, message: 'Rocket is required' }]}
          >
            <RocketPicker rockets={race.rockets || []} onChange={setSelectedRocket} />
          </Form.Item>
          <Form.Item
            name="stakeAmount"
            label={stakeAmountLabel}
            validateFirst
            rules={[
              { required: true, message: 'Stake amount is required' },
              {
                min: minStake,
                max: maxStake,
                message: `You must stake between ${formatNumber(minStake)} - ${formatNumber(maxStake)} $MAGIC`,
                type: 'number',
                transform: Number,
              },
            ]}
          >
            <Input
              type="number"
              size="large"
              placeholder={`${formatNumber(minStake)} - ${formatNumber(maxStake)}`}
              addonAfter="$MAGIC"
              value={stakeAmount}
              disabled={loading}
              onChange={handleAmountChange}
            />
          </Form.Item>
        </Form>
      </Content>
      <ModalFooter>
        <Button key="enter" loading={loading} type="primary" size="middle" ghost onClick={handleSubmit}>
          STAKE
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

  .infoTooltip {
    margin-left: 8px;
    font-size: 20px;
  }

  form {
    flex: 1;
  }
`;

export default StakeOnRocketModalContent;
