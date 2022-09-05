import { useEthers } from '@usedapp/core';
import { useParams } from 'react-router-dom';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { Button, Typography, Modal, Select, Input, Divider, Form, Alert, notification, List, Avatar } from 'antd';

import { useRace, useNftsForUser, useRaceContract, useEnsureMagicApproval } from '../../hooks';
import { shortAddress, mapNftAddress } from '../../utils';
import { INftList, IUserWlNfts } from '../../types';
import { UserNftState } from '../../constants';
import NftImage from '../NftImage';

const { Option } = Select;

function EnterRace() {
  const { account } = useEthers();
  const { raceId } = useParams();
  const race = useRace(raceId!);

  const { contract } = useRaceContract();
  const { ensureApproval } = useEnsureMagicApproval();

  const rocketsStaked = race.rockets!;
  const maxRockets = race.configSnapshot?.maxRockets!;

  const addresses = race.configSnapshot?.whitelistedNfts;
  const { nfts, loading: nftLoading } = useNftsForUser(addresses!);

  const [enterRaceForm] = Form.useForm();

  const [stakeNft, setStakeNft] = useState('');
  const [stakeNftId, setStakeNftId] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');

  const [loading, setLoading] = useState(false);
  const [enterRaceBtnDisable, setEnterRaceBtnDisable] = useState(false);
  const [selectLoading, setSelectLoading] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showEnterRaceModal, setShowEnterRaceModal] = useState(false);

  const [userNfts, setUserNfts] = useState<IUserWlNfts[]>([]);
  const [userHasNft, setUserHasNft] = useState(UserNftState.NO_WL_NFTS);
  const [nftAddress, setNftAddress] = useState('');
  const [nftContractName, setNftContractName] = useState('');

  const infoMes =
    "By executing this transaction you're only proving that you own this NFT. It will never leave your wallet.";

  let wlNfts: INftList[] = [];

  const disableEnterRaceBtn = (rocketsStaked: number, maxRockets: number) => {
    if (rocketsStaked === maxRockets) {
      setEnterRaceBtnDisable(true);
    }
  };

  if (addresses) {
    addresses.forEach((address) => wlNfts.push(mapNftAddress(address)));
    disableEnterRaceBtn(rocketsStaked.length, maxRockets);
  }

  const checkUserNfts = useCallback((displayArray: boolean[]) => {
    if (displayArray.includes(false)) {
      setUserHasNft(UserNftState.HAVE_WL_NFTS_TO_STAKE);
    } else {
      setUserHasNft(UserNftState.ALL_WL_NFTS_STAKED);
    }
  }, []);

  const displayEnterRaceModal = useCallback(() => {
    setShowEnterRaceModal(true);

    setSelectLoading(true);

    setUserNfts([]);
    let displayArray: boolean[] = [];

    Object.keys(nfts).forEach((contractAddress) =>
      nfts[contractAddress].forEach(async (id) => {
        let disabled = false;
        if (
          race.rockets!.find(
            (rocket) => rocket.nft.toLowerCase() === contractAddress.toLowerCase() && rocket.nftId.eq(id)
          )
        ) {
          disabled = true;
        }
        displayArray.push(disabled);

        const conName = mapNftAddress(contractAddress).title;

        const nftData = { address: contractAddress, contractName: conName, id: id, display: disabled };
        setUserNfts((userNfts) => [...userNfts, nftData]);
      })
    );

    checkUserNfts(displayArray);

    setSelectLoading(false);
  }, [nfts, race.rockets, checkUserNfts, setUserNfts]);

  const handleCancel = () => {
    setShowEnterRaceModal(false);
    setShowWelcomeModal(false);
  };

  const handleEnterRace = useCallback(async () => {
    setLoading(true);

    const ethersToWei = ethers.utils.parseUnits(stakeAmount, 'ether');
    try {
      await enterRaceForm.validateFields();

      await ensureApproval(ethersToWei);

      await contract.functions?.enterRace(race.id!, stakeNft, Number(stakeNftId), ethersToWei);

      notification.success({
        message: (
          <span>
            Entered the Race with {stakeNft} #{stakeNftId}
          </span>
        ),
      });

      setShowEnterRaceModal(false);
      setShowWelcomeModal(true);
    } catch (e) {
      console.error(e);
      const error = (e as any)?.message || 'Error';
      notification.error({ message: error });
    } finally {
      setLoading(false);
    }
  }, [stakeAmount, enterRaceForm, ensureApproval, contract.functions, race.id, stakeNft, stakeNftId]);

  const handleChange = (value: number) => {
    setStakeNft(userNfts[value].address);
    setNftAddress(wlNfts[value].address);
    setStakeNftId(userNfts[value].id);
    setNftContractName(userNfts[value].contractName);
  };

  const handleStakeAmountChange = useCallback((e: any) => {
    setStakeAmount(e.target.value);
  }, []);

  return (
    <>
      <Button
        type="primary"
        size="large"
        disabled={enterRaceBtnDisable}
        loading={nftLoading}
        ghost
        onClick={() => displayEnterRaceModal()}
      >
        Enter Race
      </Button>
      {race && (
        <div>
          <Form layout="vertical" form={enterRaceForm}>
            <Modal centered visible={showEnterRaceModal} width={650} onCancel={handleCancel} footer={null}>
              <ModalContent>
                {userHasNft === UserNftState.HAVE_WL_NFTS_TO_STAKE && (
                  <>
                    <div className="grid">
                      <NftImage className="NFTimg" address={nftAddress} id={1} />
                      <div>
                        <Typography.Title level={4} className="title">
                          Enter Race
                        </Typography.Title>
                        <p className="text">Choose NFT</p>
                        <Select
                          onChange={handleChange}
                          placeholder="Select a rocket to enter race"
                          className="dropdown"
                          loading={selectLoading}
                        >
                          {userNfts.map((nft, index) => (
                            <Option value={index} key={nft.address + nft.id} disabled={nft.display}>
                              {nft.contractName + ' #' + nft.id}
                            </Option>
                          ))}
                        </Select>

                        <p className="text">Stake $MAGIC </p>
                        <Form.Item name="stakeAmount" rules={[{ required: true, message: 'Stake amount is required' }]}>
                          <Input
                            type="number"
                            size="large"
                            placeholder="Magic amount to stake"
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
                        <Button
                          key="enter"
                          loading={loading}
                          onClick={handleEnterRace}
                          type="primary"
                          size="large"
                          ghost
                        >
                          ENTER
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                {userHasNft === UserNftState.ALL_WL_NFTS_STAKED && (
                  <>
                    <Alert
                      message={
                        'You have already used all of your NFTs to enter this race. You can get more from here: '
                      }
                      type="info"
                      showIcon
                      description={
                        <List
                          size="small"
                          itemLayout="horizontal"
                          dataSource={wlNfts}
                          renderItem={(item) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={<Avatar src={item.href} />}
                                title={
                                  <a href={item.url}>
                                    <h6>{item.title}</h6>
                                  </a>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      }
                    />
                  </>
                )}
                {userHasNft === UserNftState.NO_WL_NFTS && (
                  <>
                    <Alert
                      message={
                        'You dont have any eligible NFTs to enter the race. You can only use below NFTs from collections,'
                      }
                      type="info"
                      showIcon
                      description={
                        <List
                          size="small"
                          itemLayout="horizontal"
                          dataSource={wlNfts}
                          renderItem={(item) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={<Avatar src={item.href} />}
                                title={
                                  <a href={item.url}>
                                    <h6>{item.title}</h6>
                                  </a>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      }
                    />
                  </>
                )}
              </ModalContent>
            </Modal>
          </Form>

          <Modal centered visible={showWelcomeModal} onCancel={handleCancel} footer={null} width={700}>
            <ModalContent>
              <div className="grid">
                <div>
                  <NftImage className="NFTimg" address={nftAddress} id={stakeNftId} />
                </div>
                <div>
                  <Typography.Title level={3} className="title">
                    Welcome Aboard!
                  </Typography.Title>
                  <Typography.Text>
                    {nftContractName}{' '}
                    <Typography.Title level={4} className="text2">
                      #{stakeNftId}
                    </Typography.Title>
                    <br />
                    Owned by{' '}
                    <Typography.Title level={4} className="text2">
                      {shortAddress(account)}
                    </Typography.Title>
                    <br />
                    Staked{' '}
                    <Typography.Title level={4} className="text2">
                      <img width={30} src={'../assets/magic.svg'} alt="magiclogo" />
                      {stakeAmount}
                    </Typography.Title>
                  </Typography.Text>
                </div>
              </div>
              <Typography.Title level={5} className="text2">
                Hey {nftContractName} holders, I have entered my {nftContractName} into RACE TO URANUS! Check out the
                race here and cheer me on or place a side bet on me to win!
              </Typography.Title>
              <Divider />
              <div className="enterBtn">
                <Button key="enter" onClick={handleEnterRace} type="primary" size="large" ghost>
                  SHARE LINK
                </Button>
              </div>
            </ModalContent>
          </Modal>
        </div>
      )}
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
    display: inline-block;
    margin-top: 15px;
    margin-bottom: 15px;
    width: 100%;
  }
  .text2 {
    display: inline;
    margin-left: 5px;
    margin-right: 5px;
  }

  .nftImg {
    padding: 0 10px;
    margin-top: 15px;
  }
`;

export default EnterRace;
