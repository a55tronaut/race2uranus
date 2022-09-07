import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { BigNumberish, ethers } from 'ethers';
import { Button, Typography, Select, Input, Form, notification, Alert } from 'antd';

import { useNftsForUser, useRaceContract, useEnsureMagicApproval, useSelectedRace } from '../../hooks';
import { formatNumber, getNftConfig } from '../../utils';
import { blue } from '../../colors';
import { Race2Uranus } from '../../types';
import NftImage from '../NftImage';
import InfoTooltip from '../InfoTooltip';
import Rocket from '../Rocket';
import WhitelistedNfts from '../WhitelistedNfts';

const { Option } = Select;

interface INftOption {
  name: string;
  address: string;
  nftId: BigNumberish;
  disabled: boolean;
}

interface IProps {
  onClose: () => void;
}

function EnterRaceModalContent({ onClose }: IProps) {
  const race = useSelectedRace();
  const { contract } = useRaceContract();
  const { ensureApproval } = useEnsureMagicApproval();
  const { nfts, loading: nftsLoading } = useNftsForUser(race.configSnapshot?.whitelistedNfts!);
  const [form] = Form.useForm();
  const [nftOptions, setNftOptions] = useState<INftOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNft, setSelectedNft] = useState<INftOption>();
  const [stakeAmount, setStakeAmount] = useState<number>();
  const [noValidNfts, setNoValidNfts] = useState(false);
  const [allNftsUsed, setAllNftsUsed] = useState(false);

  const minStake = useMemo(() => {
    return Number(ethers.utils.formatEther(race.configSnapshot?.minStakeAmount!));
  }, [race.configSnapshot?.minStakeAmount]);
  const maxStake = useMemo(() => {
    return Number(ethers.utils.formatEther(race.configSnapshot?.maxStakeAmount!));
  }, [race.configSnapshot?.maxStakeAmount]);

  useEffect(() => {
    const opts: INftOption[] = [];
    race.configSnapshot?.whitelistedNfts!.forEach((addr) => {
      const nftConfig = getNftConfig(addr);
      nfts[addr]?.forEach((id) =>
        opts.push({
          address: addr,
          nftId: id,
          name: nftConfig.name,
          disabled: isNftUsed(race.rockets!, addr, id),
        })
      );
    });

    setNftOptions(opts);
  }, [nfts, race.configSnapshot?.whitelistedNfts, race.rockets]);

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
      await contract.functions!.enterRace(race.id!, selectedNft!.address, selectedNft!.nftId, stakeAmountWei);

      notification.success({
        message: (
          <>
            You've entered the Race with <strong>{`${selectedNft!.name} #${selectedNft?.nftId}`}</strong> and staked{' '}
            <strong>{formatNumber(stakeAmount!)} $MAGIC</strong>!
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
  }, [contract.functions, ensureApproval, form, onClose, race.id, selectedNft, stakeAmount]);

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
            <WhitelistedNfts whitelist={race.configSnapshot?.whitelistedNfts!} />
          </>
        }
      />
    </>
  );

  const stakeAmountLabel = (
    <>
      Stake $MAGIC on your rocket{' '}
      <InfoTooltip
        className="infoTooltip"
        message={
          <>
            The $MAGIC you stake will be added to the race reward pool. The more you stake the bigger share of the pool
            you will get if your rocket wins!
            <br />
            <strong>{race.configSnapshot?.rocketsSharePercent}%</strong> of the reward pool will be split between all
            rockets as a guaranteed reward on top of staking rewards!
          </>
        }
      />
    </>
  );

  return (
    <Container>
      <Content>
        <RocketContainer>
          <Rocket className="rocket" address={selectedNft?.address!} nftId={selectedNft?.nftId!} />
        </RocketContainer>
        <Form layout="vertical" form={form}>
          <Typography.Title level={4} className="title">
            Enter Race
          </Typography.Title>

          <Form.Item name="nft" label={nftSelectLabel} rules={[{ required: true, message: 'NFT is required' }]}>
            <Select placeholder="Select NFT" loading={nftsLoading} disabled={loading} onChange={handleNftChange}>
              {nftOptions.map((nft, index) => (
                <Option value={index} key={nft.address + nft.nftId} disabled={nft.disabled}>
                  <NftImage className="nftOptionImg" address={nft.address} id={nft.nftId} />{' '}
                  {nft.name + ' #' + nft.nftId}
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
      <Message>
        {noValidNfts && (
          <Alert
            type="info"
            message={
              <>
                You don't have any eligible NFTs to enter the race.
                <br />
                You can only use NFTs from these collections:{' '}
                <WhitelistedNfts whitelist={race.configSnapshot?.whitelistedNfts!} />
              </>
            }
          />
        )}
        {allNftsUsed && (
          <Alert
            type="info"
            message={
              <>
                You've already used all of your eligible NFTs to enter this race, but you can get more from the approved
                collections: <WhitelistedNfts whitelist={race.configSnapshot?.whitelistedNfts!} />
              </>
            }
          />
        )}
      </Message>
      <Footer>
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
      </Footer>
    </Container>
  );
}

function isNftUsed(rockets: Race2Uranus.RocketStructOutput[], address: string, nftId: BigNumberish) {
  return !!(rockets || []).find(
    (rocket) => rocket.nft.toLowerCase() === address.toLowerCase() && rocket.nftId.toString() === nftId.toString()
  );
}

const Container = styled.div``;

const Content = styled.div`
  display: flex;
  flex-direction: row;
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

const Message = styled.div`
  margin: 0 24px 48px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Footer = styled.div`
  border-top: 1px solid ${blue};
  width: calc(100% + 48px);
  transform: translateX(-24px);
  margin-top: 24px;
  padding: 24px 24px 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default EnterRaceModalContent;
