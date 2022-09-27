import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { BigNumberish, ethers } from 'ethers';
import { Button, Typography, Select, Input, Form, notification, Alert, Tooltip } from 'antd';
import { CopyOutlined, TwitterOutlined } from '@ant-design/icons';

import { useNftsForUser, useRaceContract, useEnsureMagicApproval, useSelectedRace, useNftMeta } from '../../hooks';
import { extractRpcError, formatNumber, getNftConfig } from '../../utils';
import { blue } from '../../colors';
import { Race2Uranus } from '../../types';
import NftImage from '../NftImage';
import InfoTooltip from '../InfoTooltip';
import Rocket from '../Rocket';
import WhitelistedNfts from '../WhitelistedNfts';
import ModalFooter from '../ModalFooter';
import NftName from '../NftName';

const { Option } = Select;

interface INftOption {
  address: string;
  nftId: BigNumberish;
  disabled: boolean;
}

function EnterRaceModalContent() {
  const { race, refresh } = useSelectedRace();
  const { contract } = useRaceContract();
  const { ensureApproval } = useEnsureMagicApproval();
  const { nfts, loading: nftsLoading } = useNftsForUser(race?.configSnapshot.whitelistedNfts!);
  const [form] = Form.useForm();
  const [nftOptions, setNftOptions] = useState<INftOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNft, setSelectedNft] = useState<INftOption>();
  const [stakeAmount, setStakeAmount] = useState<number>();
  const [noValidNfts, setNoValidNfts] = useState(false);
  const [allNftsUsed, setAllNftsUsed] = useState(false);
  const [entered, setEntered] = useState(false);
  const { meta } = useNftMeta(selectedNft?.address, selectedNft?.nftId);

  const minStake = useMemo(() => {
    return Number(ethers.utils.formatEther(race!.configSnapshot.minStakeAmount!));
  }, [race]);
  const maxStake = useMemo(() => {
    return Number(ethers.utils.formatEther(race!.configSnapshot.maxStakeAmount!));
  }, [race]);

  const shareMsg = useMemo(() => {
    return `I have entered my ${meta?.name} into Race to Uranus! Join the race or stake $MAGIC to win!`;
  }, [meta?.name]);

  useEffect(() => {
    const opts: INftOption[] = [];
    race!.configSnapshot.whitelistedNfts!.forEach((addr) => {
      nfts[addr]?.forEach((id) =>
        opts.push({
          address: addr,
          nftId: id,
          disabled: isNftUsed(race!.rockets!, addr, id),
        })
      );
    });

    const sortedOpts = opts.sort((a, b) => (a.disabled ? 1 : -1));

    setNftOptions(sortedOpts);
  }, [nfts, race]);

  useEffect(() => {
    if (!nftsLoading) {
      const _noValidNfts = nftOptions.length === 0;
      const _allNftsUsed = nftOptions.length > 0 && nftOptions.every((opt) => opt.disabled);

      setNoValidNfts(_noValidNfts);
      setAllNftsUsed(_allNftsUsed);
    }
  }, [nftOptions, nftsLoading]);

  const handleNftChange = useCallback(
    (index: number) => {
      setSelectedNft(nftOptions[index]);
    },
    [nftOptions]
  );

  const handleAmountChange = useCallback((e: any) => {
    setStakeAmount(e.target.value);
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    try {
      await form.validateFields();
      const stakeAmountWei = ethers.utils.parseEther(stakeAmount!.toString());
      await ensureApproval(stakeAmountWei);
      const res = await contract!.functions.enterRace(
        race!.id,
        selectedNft!.address,
        selectedNft!.nftId,
        stakeAmountWei
      );
      await res.wait(1);
      await refresh();

      notification.success({
        message: (
          <>
            You've entered your{' '}
            <strong>
              <NftName address={selectedNft!.address} id={selectedNft!.nftId} />
            </strong>{' '}
            into the Race and staked <strong>{formatNumber(stakeAmount!)} $MAGIC</strong>!
          </>
        ),
      });

      setEntered(true);
    } catch (e) {
      console.error(e);
      const message = extractRpcError(e);
      notification.error({ message });
    } finally {
      setLoading(false);
    }
  }, [contract, ensureApproval, form, race, refresh, selectedNft, stakeAmount]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(`${shareMsg} ${window.location.href}`);
    notification.success({ message: 'Copied!' });
  }, [shareMsg]);

  const handleShare = useCallback(async () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMsg)}&url=${encodeURIComponent(
      window.location.href
    )}&hashtags=MAGIC,Race2Uranus`;
    window.open(url, '_blank');
  }, [shareMsg]);

  const nftSelectLabel = (
    <>
      Choose your NFT{' '}
      <InfoTooltip
        className="infoTooltip"
        message={
          <>
            Your NFT will never actually leave your wallet. By entering the race you're only proving that you own the
            NFT.
            <br /> The following NFT collections can be used to enter the race:{' '}
            <WhitelistedNfts whitelist={race!.configSnapshot.whitelistedNfts!} />
          </>
        }
      />
    </>
  );

  const stakeAmountLabel = (
    <>
      Stake on your rocket{' '}
      <InfoTooltip
        className="infoTooltip"
        message={
          <>
            The <strong>$MAGIC</strong> you stake will be added to the race reward pool. The more you stake the bigger
            share of the pool you will get if your rocket wins!
            <br />
            <strong>{race!.configSnapshot.rocketsSharePercent}%</strong> of the reward pool will be split between all
            rocket owners as a <strong>guaranteed</strong> reward on top of staking rewards!
          </>
        }
      />
    </>
  );

  return (
    <Container>
      <Typography.Title level={4} className="title">
        {entered ? 'Welcome Aboard!' : 'Enter Race'}
      </Typography.Title>
      {!entered && (
        <Alert
          type="info"
          showIcon
          className="info"
          message={
            <>
              Put your{' '}
              <Tooltip
                title={
                  <>
                    You can only use NFTs from these collections:{' '}
                    <WhitelistedNfts whitelist={race!.configSnapshot.whitelistedNfts!} />
                  </>
                }
              >
                <span className="blue">eligible NFT</span>
              </Tooltip>{' '}
              into a rocket to enter the race!
              <br />
              No NFTs? No problem! Simply stake your <strong>$MAGIC</strong> on anyone's rocket by clicking the{' '}
              <strong>✨&nbsp;Stake</strong> button!
            </>
          }
        />
      )}
      <Content>
        <RocketContainer>
          <Rocket animate className="rocket" address={selectedNft?.address!} nftId={selectedNft?.nftId!} />
        </RocketContainer>
        <FormContainer>
          {entered ? (
            <ShareCallToAction>
              <div>
                Share this message on the <strong>{getNftConfig(selectedNft?.address!)?.name}</strong> community{' '}
                <img className="discord" src="/assets/discord.svg" alt="Discord" /> <strong>Discord</strong> to get
                others to stake on your rocket!
              </div>
              <br />
              <Alert
                className="quote"
                type="info"
                message={
                  <span>
                    {shareMsg}
                    <br />
                    {window.location.href}
                  </span>
                }
              />
            </ShareCallToAction>
          ) : (
            <Form layout="vertical" form={form}>
              <Form.Item name="nft" label={nftSelectLabel} rules={[{ required: true, message: 'NFT is required' }]}>
                <Select
                  placeholder="Select NFT"
                  loading={nftsLoading}
                  disabled={loading}
                  size="large"
                  onChange={handleNftChange}
                >
                  {nftOptions.map((nft, index) => (
                    <Option value={index} key={nft.address + nft.nftId} disabled={nft.disabled}>
                      <NftImage className="nftOptionImg" address={nft.address} id={nft.nftId} />{' '}
                      <NftName address={nft.address} id={nft.nftId} />
                    </Option>
                  ))}
                </Select>
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
                    message: `You must stake ${formatNumber(minStake)} - ${formatNumber(maxStake)} $MAGIC`,
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
          )}
        </FormContainer>
      </Content>
      {(noValidNfts || allNftsUsed) && (
        <Message>
          {noValidNfts && (
            <Alert
              type="info"
              message={
                <>
                  You don't have any eligible NFTs to enter the race.
                  <br />
                  You can only use NFTs from these collections:{' '}
                  <WhitelistedNfts whitelist={race!.configSnapshot.whitelistedNfts!} />
                  <br />
                  Remember that you can always <strong>✨&nbsp;Stake</strong> on a rocket with your{' '}
                  <strong>$MAGIC</strong>!
                </>
              }
            />
          )}
          {allNftsUsed && (
            <Alert
              type="info"
              message={
                <>
                  You've already used all of your eligible NFTs to enter this race, but you can get more from the
                  approved collections: <WhitelistedNfts whitelist={race!.configSnapshot.whitelistedNfts!} />
                  <br />
                  Or you can always <strong>✨&nbsp;Stake</strong> on a rocket with your <strong>$MAGIC</strong>!
                </>
              }
            />
          )}
        </Message>
      )}
      <ModalFooter>
        {entered ? (
          <>
            <Button key="copy" type="primary" size="middle" className="copyBtn" ghost onClick={handleCopy}>
              <CopyOutlined /> COPY
            </Button>
            <Button key="share" type="primary" size="middle" ghost onClick={handleShare}>
              <TwitterOutlined /> SHARE
            </Button>
          </>
        ) : (
          <Button
            key="enter"
            loading={loading}
            disabled={noValidNfts || allNftsUsed}
            type="primary"
            size="middle"
            ghost
            onClick={handleSubmit}
          >
            ENTER
          </Button>
        )}
      </ModalFooter>
    </Container>
  );
}

function isNftUsed(rockets: Race2Uranus.RocketStructOutput[], address: string, nftId: BigNumberish) {
  return !!(rockets || []).find(
    (rocket) => rocket.nft.toLowerCase() === address.toLowerCase() && rocket.nftId.toString() === nftId.toString()
  );
}

const Container = styled.div`
  padding-top: 24px;

  .title {
    color: ${blue};
    text-align: center;
    margin-bottom: 24px;
  }

  .copyBtn {
    margin-right: 36px;
  }

  .info {
    margin: 0 24px 24px 24px;
  }

  .blue {
    color: ${blue};
    cursor: pointer;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  padding: 24px 24px 0 24px;

  .infoTooltip {
    margin-left: 8px;
    font-size: 20px;
  }

  form {
    flex: 1;
  }
`;

const ShareCallToAction = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .discord {
    height: 16px;
    vertical-align: middle;
  }

  /* .quote::before {
    content: '"';
    display: block;
    position: absolute;
    top: -38px;
    left: -38px;
    font-size: 80px;
  }
  .quote::after {
    content: '"';
    display: block;
    position: absolute;
    bottom: -38px;
    right: -38px;
    font-size: 80px;
  } */
`;

const RocketContainer = styled.div`
  flex: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  flex-basis: 200px;

  .rocket {
    width: 100px;
  }
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  form {
    width: 100%;
  }
`;

const Message = styled.div`
  margin: 0 24px 48px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default EnterRaceModalContent;
