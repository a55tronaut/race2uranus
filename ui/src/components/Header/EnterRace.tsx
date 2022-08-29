import { useParams } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { useCallback, useState } from 'react';
import { Button, Typography, Modal, Select, Input, Divider, Form, Alert } from 'antd';
import styled from 'styled-components';
import { BigNumber } from 'ethers';

import { useRace, useNftsForUser } from '../../hooks';

interface INftsForUser {
  [key: string]: BigNumber[];
}

const { Option } = Select;

function EnterRace() {
  const { raceId } = useParams();
  const { account } = useEthers();
  const race = useRace(raceId!);
  const { configSnapshot, rockets } = useRace(BigNumber.from(0));

  const addresses = configSnapshot?.whitelistedNfts;
  const add = ['0x46becf6735d3ef798307035ad91cb709970bf321', '0x0cdd4ab6a82d8b4efcab7eee8f6722b20df61592'];
  const { nfts, loading, error } = useNftsForUser(addresses!);

  const rocketsStaked = race.rockets!;

  if (account && addresses) {
    // calcAvalibleNFTsToStake(rocketsStaked, nfts, account);
  }

  // console.log('nfts: ' + JSON.stringify(nfts) + '  ' + Object.keys(nfts));
  // console.log('stk: ' + rockets!.length);

  const [showEnterRaceModal, setShowEnterRaceModal] = useState(false);
  const [nftPath, setNftPath] = useState('/assets/NFT/smolbrain.png');

  const infoMes =
    "You're only proving that you own this NFT. It will never leave your wallet nor it will be edited in any way.";
  const { Title, Text } = Typography;
  const { Option } = Select;

  function EnterRace() {
    const [showEnterRaceModal, setShowEnterRaceModal] = useState(false);
    const [loadEnterRaceModal, setloadEnterRaceModal] = useState(false);
    const [nftPath, setNftPath] = useState('/assets/NFT/smolbrain.png');

    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    const displayEnterRaceModal = useCallback(() => {
      setShowEnterRaceModal(true);
    }, []);

    const handleCancel = () => {
      setShowEnterRaceModal(false);
      setShowWelcomeModal(false);
    };

    const handleEnterRace = useCallback(() => {
      setShowEnterRaceModal(false);
      setShowWelcomeModal(true);
    }, []);

    const handleChange = (value: string) => {
      setNftPath('/assets/NFT/' + value + '.png');
    };

    const handleStakeAmountChange = useCallback((e: any) => {
      //(e.target.value);
    }, []);

    return (
      <>
        <Button type="primary" size="large" ghost onClick={() => displayEnterRaceModal()}>
          Enter Race
        </Button>
        <Form layout="vertical">
          <Modal centered visible={showEnterRaceModal} width={650} onCancel={handleCancel} footer={null}>
            <ModalContent>
              <div className="grid">
                <div>
                  <img width={200} src={nftPath} alt="NFTrocketImg" />
                </div>
                <div>
                  <Typography.Title level={4} className="title">
                    Enter Race
                  </Typography.Title>

                  <p className="text">Choose NFT</p>
                  <Select defaultValue="smolbrain" onChange={handleChange} className="dropdown">
                    <Option value="smolbrain">SMOL BRAIN #7581</Option>
                    <Option value="toe">TALES OF ELLARIA #1234</Option>
                    <Option value="smolcars">SMOL CARS #0234 </Option>
                  </Select>

                  <p className="text">Stake $MAGIC </p>
                  <Form.Item
                    name="stakeAmount"
                    rules={[
                      { required: true, message: 'Stake amount is required' },
                      // { validator: (_, value) => validateAmount(value) },
                    ]}
                  >
                    <Input
                      type="number"
                      size="large"
                      placeholder="Magic amount to stake"
                      // initialValue={minStakeAmount}
                      addonAfter="Magic"
                      onChange={handleStakeAmountChange}
                    />
                  </Form.Item>
                </div>
              </div>
              <Alert message={infoMes} type="info" showIcon />
              <div className="footer">
                <Divider />
                <div className="enterBtn">
                  <Button key="enter" onClick={handleEnterRace} type="primary" size="large" ghost>
                    ENTER
                  </Button>
                </div>
              </div>
            </ModalContent>
          </Modal>
        </Form>
        {/*
  <Modal centered visible={showWelcomeModal} onCancel={handleCancel} footer={null} width={700}>
=======
      <Modal centered visible={showEnterRaceModal} onCancel={handleCancel} footer={null} width={700}>
        <ModalContent>
          <div className="grid">
            <div>
              <img width={300} src={nftPath} alt="NFTrocketImg" />
            </div>
            <div>
              <Typography.Title level={3} className="title">
                Enter Race
              </Typography.Title>

              <p className="text">Choose NFT</p>
              <Select defaultValue="smolbrain" onChange={handleChange}>
                <Option value="smolbrain">SMOL BRAIN #7581</Option>
                <Option value="toe">TALES OF ELLARIA #1234</Option>
                <Option value="smolcars">SMOL CARS #0234 </Option>
              </Select>

              <p className="text">Stake $MAGIC </p>
              <Input placeholder="" />
            </div>
          </div>
          <Divider />
          <div className="enterBtn">
            <Button key="enter" onClick={handleEnterRace} type="primary" size="large" ghost>
              ENTER
            </Button>
          </div>
        </ModalContent>
      </Modal>
      <Modal centered visible={showWelcomeModal} onCancel={handleCancel} footer={null} width={700}>
>>>>>>> main
        <ModalContent>
          <div className="grid">
            <div>
              <img width={300} src={nftPath} alt="NFTrocketImg" />
            </div>
            <div>
              <Typography.Title level={3} className="title">
                Welcome Aboard!
              </Typography.Title>

              <p>Smol Brains #7581</p>
              <p>Owned by 0x9178...5e34</p>

              <div className="flex">
                <p className="text2">Staked</p>
                <img width={30} src={'../assets/magic.svg'} alt="magiclogo" />
                <p className="text2">520</p>
              </div>
            </div>
          </div>
          <p className="text">
            Hey Smol Brains holders, I have entered my Smol Brain into RACE TO URANUS! Check out the race here and cheer
            me on or place a side bet on me to win!
          </p>
          <Divider />
          <div className="enterBtn">
            <Button key="enter" onClick={handleEnterRace} type="primary" size="large" ghost>
              SHARE LINK
            </Button>
          </div>
        </ModalContent>
      </Modal>
<<<<<<< HEAD
                */}
      </>
    );
  }
}

const ModalContent = styled.div`
  margin-top: 20px;

  .enterBtn {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    align-items: center;
    margin-top: 10px;
  }
  .grid {
    display: grid;
    grid-template-columns: auto auto auto;
  }
  .title {
    color: #009bff;
    text-align: center;
  }
  .text {
    margin-top: 25px;
  }
  .dropdown {
    width: 100%;
  }

  .flex {
    display: flex;
  }
  .text2 {
    margin-left: 5px;
    margin-right: 5px;
  }
`;
function calcAvalibleNFTsToStake(stakedRockets: any, userWlNFTs: any, account: any) {
  const res: INftsForUser = {};
  for (let i = 0; i < stakedRockets.length; i++) {
    if (stakedRockets[i].rocketeer === account) {
      res[stakedRockets[i].nft] = stakedRockets[i].nftId;
    }
  }

  console.log('alreadyStaked: ' + JSON.stringify(res));
  console.log('userWlNFTs: ' + JSON.stringify(userWlNFTs));

  const stakedNftCount = Object.keys(res).length;
  for (let i = 0; i < stakedNftCount; i++) {
    const address = Object.keys(res)[i];
    const id = res[address];
    const ids = userWlNFTs[address];
    // console.log(address + ' , ' + id);
    // console.log(Object.keys(ids)); // 0 , 1 ,2
  }
}

export default EnterRace;
