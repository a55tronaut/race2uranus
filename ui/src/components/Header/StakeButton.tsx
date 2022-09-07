import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Modal, Select, Input, Divider, notification, Form } from 'antd';
import styled from 'styled-components';
import { ethers } from 'ethers';

import { useRaceContract, useRace, useEnsureMagicApproval } from '../../hooks';
import { getNftConfig, mapNftAddress } from '../../utils';
import { IUserWlNfts } from '../../types';
import { blue } from '../../colors';
import NftImage from '../NftImage';

const { Text } = Typography;
const { Option } = Select;

function StakeButton() {
  const { raceId } = useParams();
  const race = useRace(raceId!);
  const rocketsStaked = race.rockets!;

  const { contract } = useRaceContract();
  const { ensureApproval } = useEnsureMagicApproval();

  const [stakeForm] = Form.useForm();

  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeRocketId, setStakeRocketId] = useState(-1);
  const [stakeAmount, setStakeAmount] = useState('');

  const [userWlNfts, setUserWlNfts] = useState<IUserWlNfts[]>([]);

  const [loading, setLoading] = useState(false);
  const [selectedNftId, setSelectedNftId] = useState('');
  const [selectLoading, setSelectLoading] = useState(true);
  const [selectedNftAdddress, setSelectedNftAdddress] = useState('');

  const handleStake = useCallback(async () => {
    try {
      setLoading(true);

      await stakeForm.validateFields();

      const ethersToWei = ethers.utils.parseUnits(stakeAmount, 'ether');
      await ensureApproval(ethersToWei);

      await contract.functions?.stakeOnRocket(race.id!, Number(stakeRocketId), ethersToWei);

      notification.success({
        message: (
          <span>
            Successfully staked on rocket #{stakeRocketId} for {stakeAmount} MAGIC.
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
  }, [stakeAmount, stakeForm, ensureApproval, contract.functions, race.id, stakeRocketId]);

  const displayStakeModal = useCallback(() => {
    setShowStakeModal(true);

    setSelectLoading(true);

    setUserWlNfts([]);

    rocketsStaked.forEach(async (rocket) => {
      const rocketNftAddr = rocket.nft;
      const rocketNftId = rocket.nftId.toString();

      const rocketNftName = getNftConfig(rocket.nft).name;

      const nftData = { address: rocketNftAddr, id: rocketNftId, contractName: rocketNftName };
      setUserWlNfts((userWlNfts) => [...userWlNfts, nftData]);
    });

    setSelectLoading(false);
  }, [rocketsStaked]);

  const handleCancel = () => {
    setShowStakeModal(false);
  };

  const handleChange = (value: number) => {
    setSelectedNftAdddress(userWlNfts[value].address);
    setSelectedNftId(userWlNfts[value].id);
    setStakeRocketId(value + 1);
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
        <Text style={{ color: blue }} className="counterText">
          Final Stake In
        </Text>
        <Text className="counterTime">04:54:59</Text>
      </StakeCounter>
      <Form form={stakeForm}>
        <Modal centered visible={showStakeModal} onCancel={handleCancel} footer={null} width={700}>
          <ModalContent>
            <div className="grid">
              <div>
                <NftImage className="NFTimg" address={selectedNftAdddress} id={selectedNftId} />
              </div>
              <div>
                <Typography.Title level={3} className="title">
                  Stake on a Rocket
                </Typography.Title>

                <Select
                  className="child"
                  loading={selectLoading}
                  placeholder="Select a rocket to stake"
                  onChange={handleChange}
                >
                  {userWlNfts.map((nft, index) => (
                    <Option value={index} key={index}>
                      Rocket #{index + 1} - {nft.contractName} #{nft.id}
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
    color: ${blue};
    text-align: center;
  }
  .child {
    display: inline-block;
    margin-top: 15px;
    margin-bottom: 15px;
    width: 100%;
  }
  .NFTimg {
    width: 200px;
  }
`;

export default StakeButton;
