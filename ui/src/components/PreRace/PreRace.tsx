import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Contract } from 'ethers';
import { Form, Button, Modal, Divider, Typography, Alert, notification } from 'antd';

import { rockets } from './rocketsData';
import NftImage from '../NftImage';
import { useRace, useRaceContract } from '../../hooks';
import { totalRockets } from '../../constants';
import { IRocket } from '../../types';
import { shortAddress } from '../../utils';

import { useEthersSigner } from '../../hooks/useEthersSigner';
import ERC721ABI from '../../abi/ERC721.json';

function PreRace() {
  const { Paragraph, Text } = Typography;

  const { raceId } = useParams();
  const race = useRace(raceId!);
  const boostAmount = race.configSnapshot?.boostAmount!;
  const rocketsStaked = race.rockets!;
  const stakedRocketsAmount = rocketsStaked?.length + 1;

  const { signer } = useEthersSigner();
  const { contract } = useRaceContract();

  const [showBoostModal, setShowBoostModal] = useState(false);
  const [loadBoostModal, setLoadBoostModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rocketId, setRocketId] = useState(0);
  const [rocketNftId, setrocketNftId] = useState('');
  const [rocketNftName, setrocketNftName] = useState('');
  const [rocketNftHolder, setrocketNftHolder] = useState('');

  const displayBoostModal = useCallback(
    (rocket: IRocket) => {
      setLoadBoostModal(true);
      setRocketId(rocket.id);
      const currentRocket = Number(rocket.id) - 1;
      const rocketNft = rocketsStaked?.[currentRocket].nft;
      const rocketNftId = rocketsStaked?.[currentRocket].nftId;
      const rocketNftHolder = rocketsStaked?.[currentRocket].rocketeer;

      if (rocketNft && rocketNftId) {
        getContractName(rocketNft.toString());
        setrocketNftId(rocketNftId.toString());
        setrocketNftHolder(rocketNftHolder.toString());
      }

      setShowBoostModal(true);
      setLoadBoostModal(false);

      async function getContractName(address: string) {
        const contract: any = new Contract(address, ERC721ABI, signer);
        const contractName = await contract!.functions.name();
        setrocketNftName(contractName);
      }
    },
    [rocketsStaked, signer]
  );

  const handleOk = () => {
    setShowBoostModal(false);
  };

  const handleCancel = () => {
    setShowBoostModal(false);
  };

  const handleBoost = useCallback(async () => {
    try {
      setLoading(true);

      await contract.functions?.applyBoost(race.id!, rocketId - 1);

      notification.success({
        message: (
          <span>
            Boost applied to {rocketNftName} {rocketNftId}
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
  }, [contract.functions, race.id, rocketNftName, rocketNftId, rocketId]);

  return (
    <>
      <PreRaceText>
        <Typography.Title level={2} className="title">
          Welcome To The Launch Pad!
        </Typography.Title>
        <Paragraph className="text">
          You are about to enter the <Text strong> Race of Uranus. </Text> Choose an empty space <br />
          vehicle to be able to participate. <br /> You can also stake on any rocket and boost it's propulsion system{' '}
          <br /> with your <Text strong> $MAGIC</Text>.
        </Paragraph>
        <Typography.Title level={5} className="prizeHeader">
          Join to Earn Up To
        </Typography.Title>
        <div className="priceEarn">
          <img src="../assets/magic.svg" alt="magicLogo" className="myImage" />
          <Typography.Title level={2} className="heading">
            {
              // rewardAmount.toString()
            }
          </Typography.Title>
        </div>
      </PreRaceText>
      <Container id="rockets">
        {rockets.slice(0, totalRockets).map((rocket) => (
          <div id={rocket.alt} className="rocket" key={'div' + rocket.id}>
            <img width={100} src={'../assets/rocket.svg'} alt={rocket.alt} key={rocket.id} />
            {rocket.id < stakedRocketsAmount! && (
              <>
                <div className="border">
                  <NftImage
                    className="nftImg"
                    address="0x6325439389E0797Ab35752B4F43a14C004f22A9c"
                    id={rocketsStaked?.[rocket.id - 1]?.nftId}
                  />
                </div>
                <Button
                  key={'btn' + rocket.id}
                  id={'btn' + rocket.id}
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
          <Modal centered visible={showBoostModal} onOk={handleOk} onCancel={handleCancel} width={650} footer={null}>
            <ModalContent>
              <div className="grid">
                <NftImage className="NFTimg" address="0x6325439389E0797Ab35752B4F43a14C004f22A9c" id={rocketNftId} />
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
  }
  .myImage {
    float: left;
    margin-right: 10px;
    display: block;
    height: 40px;
    width: 40px;
  }
  .heading {
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
    color: #009bff;
    text-align: center;
    margin-bottom: 25px;
  }
  .text1 {
    display: inline;
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
