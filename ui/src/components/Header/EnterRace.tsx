import { useParams } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { Button, Typography, Modal, Select, Input, Divider, Form, Alert, notification } from 'antd';
import styled from 'styled-components';
import { BigNumber, Contract, ethers } from 'ethers';

import { useRace, useNftsForUser, useRaceContract } from '../../hooks';
import { useEthersSigner } from '../../hooks/useEthersSigner';
import NftImage from '../NftImage';
import ERC721ABI from '../../abi/ERC721.json';

const { Option } = Select;

function EnterRace() {
  const { raceId } = useParams();
  const race = useRace(raceId!);

  const { signer } = useEthersSigner();
  const { contract } = useRaceContract();

  const addresses = race.configSnapshot?.whitelistedNfts;
  const { nfts } = useNftsForUser(addresses!);

  const [stakeAmount, setStakeAmount] = useState('');
  const [enterRaceNft, setEnterRaceNft] = useState('');
  const [enterRaceId, setEnterRaceId] = useState('');

  const [showEnterRaceModal, setShowEnterRaceModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [nftPath, setNftPath] = useState('/assets/NFT/smolbrain.png');

  const [userNft, setuserNft] = useState<{ address: string; contractName: string; id: string; display: boolean }[]>([]);
  const [rocketNftName, setrocketNftName] = useState('');

  const infoMes =
    "By executing this transaction you're only proving that you own this NFT. It will never leave your wallet.";

  const displayEnterRaceModal = useCallback(() => {
    setShowEnterRaceModal(true);

    Object.keys(nfts).forEach((contractAddress) =>
      nfts[contractAddress].forEach((id) => {
        let disabled = false;
        if (race.rockets!.find((rocket) => rocket.nft === contractAddress && rocket.nftId.eq(id))) {
          disabled = true;
        }

        getContractName(contractAddress);
        let newData = { address: contractAddress, contractName: rocketNftName, id: id, display: disabled };
        setuserNft((userNft) => [...userNft, newData]);
      })
    );

    async function getContractName(address: string) {
      const SimpleNft: any = new Contract(address, ERC721ABI, signer);
      const contractName = await SimpleNft!.functions.name();
      setrocketNftName(contractName);
    }
  }, [nfts, race.rockets, signer, rocketNftName]);

  const handleCancel = () => {
    setShowEnterRaceModal(false);
    setShowWelcomeModal(false);
  };

  const handleEnterRace = useCallback(async () => {
    setLoading(true);
    const ethersToWei = ethers.utils.parseUnits(stakeAmount, 'ether');
    try {
      await contract.functions?.enterRace(race.id!, enterRaceNft, Number(enterRaceId), ethersToWei);

      notification.success({
        message: (
          <span>
            Enterred the Race with {enterRaceNft} #{enterRaceId}
          </span>
        ),
      });
    } catch (e) {
      console.error(e);
      const error = (e as any)?.message || 'Error';
      notification.error({ message: error });
    } finally {
      setLoading(false);
      setShowEnterRaceModal(false);
      setShowWelcomeModal(true);
    }
  }, [contract.functions, enterRaceId, enterRaceNft, race.id, stakeAmount]);

  const handleChange = (value: string) => {
    setEnterRaceNft(value.split('/')[0]);
    setEnterRaceId(value.split('/')[1]);
    //  setNftPath('/assets/NFT/' + value + '.png');
  };

  const handleStakeAmountChange = useCallback((e: any) => {
    setStakeAmount(e.target.value);
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
                <Select onChange={handleChange} className="dropdown">
                  {userNft.map((emp, index) => (
                    <Option value={emp.address + '/' + emp.id} key={emp.address + emp.id} disabled={emp.display}>
                      {emp.contractName}
                    </Option>
                  ))}
                </Select>

                <p className="text">Stake $MAGIC </p>
                <Form.Item name="stakeAmount" rules={[{ required: true, message: 'Stake amount is required' }]}>
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
                <Button key="enter" loading={loading} onClick={handleEnterRace} type="primary" size="large" ghost>
                  ENTER
                </Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </Form>
      {
        <Modal centered visible={showWelcomeModal} onCancel={handleCancel} footer={null} width={700}>
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
              Hey Smol Brains holders, I have entered my Smol Brain into RACE TO URANUS! Check out the race here and
              cheer me on or place a side bet on me to win!
            </p>
            <Divider />
            <div className="enterBtn">
              <Button key="enter" onClick={handleEnterRace} type="primary" size="large" ghost>
                SHARE LINK
              </Button>
            </div>
          </ModalContent>
        </Modal>
      }
    </>
  );
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

export default EnterRace;
