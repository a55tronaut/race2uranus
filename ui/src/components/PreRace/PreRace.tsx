import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { Form, Button, Modal, Divider, Typography, Alert, notification } from 'antd';

import { useRace, useRaceContract, useEnsureMagicApproval } from '../../hooks';
import { shortAddress, mapNftAddress, getNftConfig } from '../../utils';
import { blue } from '../../colors';
import NftImage from '../NftImage';
import RocketPicker from '../RocketPicker';

const { Paragraph, Text } = Typography;

function PreRace() {
  const { raceId } = useParams();
  const race = useRace(raceId!);

  const boostAmount = race.configSnapshot?.boostAmount!;
  const boostPrice = race.configSnapshot?.boostPrice!;
  const rocketsStaked = race.rockets!;
  const stakedRocketsAmount = rocketsStaked?.length + 1;
  const raceReward = race.rewardPool;

  const { contract } = useRaceContract();
  const { ensureApproval } = useEnsureMagicApproval();

  const [showBoostModal, setShowBoostModal] = useState(false);
  const [loadBoostModal, setLoadBoostModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rocketId, setRocketId] = useState(0);
  const [rocketNftId, setrocketNftId] = useState('');
  const [rocketNftAddr, setrocketNftAddr] = useState('');
  const [rocketNftName, setrocketNftName] = useState('');
  const [rocketNftHolder, setrocketNftHolder] = useState('');

  const displayBoostModal = useCallback(
    async (rocket: any) => {
      setLoadBoostModal(true);
      setRocketId(rocket.id);
      const currentRocket = Number(rocket.id);
      const rocketNft = rocketsStaked?.[currentRocket].nft;
      const rocketNftId = rocketsStaked?.[currentRocket].nftId;

      const rocketNftHolder = rocketsStaked?.[currentRocket].rocketeer;

      if (rocketNft && rocketNftId) {
        const conName = getNftConfig(rocketNft).name;

        setrocketNftName(conName);
        setrocketNftAddr(rocketNft);
        setrocketNftId(rocketNftId.toString());
        setrocketNftHolder(rocketNftHolder);
      }

      setShowBoostModal(true);
      setLoadBoostModal(false);
    },
    [rocketsStaked]
  );

  const handleCancel = () => {
    setShowBoostModal(false);
  };

  const handleBoost = useCallback(async () => {
    try {
      setLoading(true);

      await ensureApproval(boostPrice);

      await contract.functions?.applyBoost(race.id!, rocketId);

      notification.success({
        message: (
          <span>
            Boost applied to {rocketNftName} #{rocketNftId}
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
  }, [contract.functions, race.id, rocketId, rocketNftName, rocketNftId, boostPrice, ensureApproval]);

  return (
    <>
      <PreRaceText>
        <Typography.Title level={2} className="title">
          Welcome To The Launch Pad!
        </Typography.Title>
        <Paragraph className="text">
          You are about to enter the <Text strong> Race 2 Uranus. </Text> Choose an empty rocket to join the race.{' '}
          <br /> You can also stake on any rocket or boost its propulsion system with your <Text strong> $MAGIC</Text>.
        </Paragraph>
        <Typography.Title level={5} className="prizeHeader">
          Join to Earn Up To
        </Typography.Title>
        <div className="priceEarn">
          <img src="../assets/magic.svg" alt="magicLogo" className="myImage" />
          <Typography.Title level={2} className="heading">
            {raceReward && <div>{ethers.utils.formatEther(raceReward!)}</div>}
          </Typography.Title>
        </div>
      </PreRaceText>
      <Container id="rockets">
        {rocketsStaked &&
          rocketsStaked.map((rocket, index) => (
            <div className="rocket" key={rocket.id}>
              <img width={100} src={'../assets/rocket.svg'} alt={'rck' + rocket.id} />
              {rocket.id < stakedRocketsAmount! && (
                <>
                  <div className="border">
                    <NftImage
                      className="nftImg"
                      address={rocketsStaked?.[rocket.id]?.nft}
                      id={rocketsStaked?.[rocket.id]?.nftId}
                    />
                  </div>
                  <Button
                    id={'BoostBtn' + rocket.id}
                    loading={loadBoostModal}
                    onClick={() => displayBoostModal(rocket)}
                    type="primary"
                    size="middle"
                    ghost
                  >
                    BOOST
                  </Button>
                </>
              )}
            </div>
          ))}
        <Form layout="vertical">
          <Modal centered visible={showBoostModal} onCancel={handleCancel} width={650} footer={null}>
            <ModalContent>
              <div className="grid">
                <NftImage className="NFTimg" address={rocketNftAddr} id={rocketNftId} />
                <div>
                  <Typography.Title level={4} className="title">
                    Boost Rocket
                  </Typography.Title>

                  <Typography.Text>
                    Boost Rocket{' '}
                    <Typography.Title level={4} className="text2">
                      #{rocketId}
                    </Typography.Title>
                    <br />
                    Rocket NFT{' '}
                    <Typography.Title level={4} className="text2">
                      {rocketNftName} #{rocketNftId}
                    </Typography.Title>
                    <br />
                    Owner by{' '}
                    <Typography.Title level={4} className="text2">
                      {shortAddress(rocketNftHolder)}
                    </Typography.Title>
                    <br />
                    Boost Cost{' '}
                    <Typography.Title level={4} className="text2">
                      {boostAmount}
                    </Typography.Title>{' '}
                    Magic
                  </Typography.Text>
                </div>
              </div>
              <div className="footer">
                <Alert message="This boost has a chance to speed up or slow down the rocket." type="info" showIcon />
                <Divider />
                <div className="payBtn">
                  <Button key="pay" onClick={handleBoost} type="primary" size="middle" loading={loading} ghost>
                    Pay
                  </Button>
                </div>
              </div>
            </ModalContent>
          </Modal>
        </Form>
        <RocketPicker rockets={race.rockets || []} onSelect={console.log} />
      </Container>
    </>
  );
}

const PreRaceText = styled.div`
  height: 100%;

  .title {
    position: absolute;
    left: 50%;
    top: 25%;
    transform: translate(-50%, -50%);
  }
  .text {
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  .prizeHeader {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
  }
  .priceEarn {
    position: absolute;
    display: flex;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 320px;
    height: 120px;
    background-color: purple;
    align-items: center;
    padding-left: 5%;
  }
  .myImage {
    float: left;
    margin-right: 10px;
    display: block;
    height: 40px;
    width: 40px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 10%;

  .rocket {
    margin: 0 20px;
    padding: 0 10px;
    display: flex;
    width: 120px;
    position: relative;
    z-index: 6;
    display: flex;
    flex-direction: column;
    top: 1 00px;
  }

  .boost {
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0px 0px 9px 4px #f0683d;
  }
  @keyframes glow {
    to {
      box-shadow: 0px 0px 30px 20px #f0683d;
    }
  }

  .nftImg {
    padding: 0 10px;
    display: flex;
    width: 86px;
    position: absolute;
    z-index: 7;
    top: 14%;
    right: 16px;
    border-radius: 50%;
  }
`;

const ModalContent = styled.div`
  .grid {
    margin-top: 25px;
    display: grid;
    grid-template-columns: auto auto auto;
  }
  .title {
    color: ${blue};
    text-align: center;
    margin-bottom: 25px;
  }
  .text2 {
    display: inline;
  }
  .NFTimg {
    width: 200px;
  }
  .payBtn {
    display: flex;
    justify-content: center;
  }
  .footer {
    margin-top: 10px;
  }
`;

export default PreRace;
