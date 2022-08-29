import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Modal, Select, Input, Divider, notification, Form } from 'antd';
import styled from 'styled-components';
import { ethers } from 'ethers';

import { useRaceContract, useRace } from '../../hooks';
import { rockets } from '../PreRace/rocketsData';

const { Text } = Typography;
const { Option } = Select;

function StakeButton() {
  const { raceId } = useParams();
  const race = useRace(raceId!);
  const rocketsStaked = race.rockets!;
  const stakedRocketsAmount = rocketsStaked?.length;

  const { contract } = useRaceContract();

  const [stakeForm] = Form.useForm();

  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeRocket, setStakeRocket] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStake = useCallback(async () => {
    const ethersToWei = ethers.utils.parseUnits(stakeAmount, 'ether');
    try {
      setLoading(true);

      await stakeForm.validateFields();

      await contract.functions?.stakeOnRocket(race.id!, Number(stakeRocket), ethersToWei);

      notification.success({
        message: (
          <span>
            Succesfully staked on rocket #{stakeRocket} for {stakeAmount} MAGIC.
          </span>
        ),
      });
    } catch (e) {
      console.error(e);
      const error = (e as any)?.message || 'Error';
      notification.error({ message: error });
    } finally {
      setLoading(false);
    }
  }, [contract.functions, stakeForm, stakeRocket, race.id, stakeAmount]);

  const displayStakeModal = useCallback(() => {
    setShowStakeModal(true);
  }, []);

  const handleCancel = () => {
    setShowStakeModal(false);
  };

  const handleChange = (value: string) => {
    setStakeRocket(value);
  };

  const handleMagicChange = useCallback((e: any) => {
    setStakeAmount(e.target.value);
  }, []);

  return (
    <StakeWrapper>
      <Button className="stakeButton" type="primary" size="large" ghost onClick={() => displayStakeModal()}>
        STAKE
      </Button>
      <StakeCounter>
        <Text style={{ color: '#009bff' }} className="counterText">
          Final Stake In
        </Text>
        <Text className="counterTime">04:54:59</Text>
      </StakeCounter>
      <Form form={stakeForm}>
        <Modal centered visible={showStakeModal} onCancel={handleCancel} footer={null} width={700}>
          <ModalContent>
            <div className="grid">
              <div>
                <img width={70} src="/assets/rocket.svg" alt="Rocket" />
              </div>
              <div>
                <Typography.Title level={3} className="title">
                  Stake on a Rocket
                </Typography.Title>

                <Select className="child" defaultValue="0" onChange={handleChange}>
                  <Option key="0" value="0">
                    Select a rocket to stake
                  </Option>
                  {rockets.slice(0, stakedRocketsAmount).map((rocket) => (
                    <Option key={rocket.id} value={rocket.id}>
                      Rocket #{rocket.id}
                    </Option>
                  ))}
                </Select>

                <Form.Item name="stakeMagicAmount" rules={[{ required: true, message: 'The amount is required' }]}>
                  <Input
                    type="number"
                    addonBefore="Stake"
                    suffix=" $MAGIC"
                    placeholder="Magic Amount to Stake"
                    onChange={handleMagicChange}
                    required={true}
                  />
                </Form.Item>
              </div>
            </div>
            <Divider />
            <div className="enterBtn">
              <Button key="stake" loading={loading} type="primary" size="large" ghost onClick={handleStake}>
                STAKE
              </Button>
            </div>
          </ModalContent>
        </Modal>
      </Form>
    </StakeWrapper>
  );
}

const StakeWrapper = styled.div`
  text-align: center;
  margin-top: 25px;
`;

const StakeCounter = styled.div`
  margin-top: 5px;
  .counterTime {
    margin-left: 10px;
  }
`;

const ModalContent = styled.div`
  .enterBtn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .grid {
    display: grid;
    grid-template-columns: auto auto auto;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 5%;
  }
  .title {
    color: #009bff;
    text-align: center;
  }
  .text {
    margin-top: 25px;
  }

  .child {
    display: inline-block;
    margin-top: 15px;
    margin-bottom: 15px;
    width: 100%;
  }

  .text2 {
    margin-left: 5px;
    margin-right: 5px;
  }
`;

export default StakeButton;
