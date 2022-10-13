import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography } from 'antd';
import styled from 'styled-components';
import cn from 'classnames';
import { useEthers } from '@usedapp/core';
import { BigNumberish } from 'ethers';

import { FINAL_APPROACH_SECONDS, SECOND_MILLIS } from '../../constants';
import { Race2Uranus } from '../../types';
import { orange } from '../../colors';
import { useRaceContract } from '../../hooks';
import { howl } from '../../utils';
import Layout from '../Layout';
import Rocket from '../Rocket';
import NftName from '../NftName';

interface IProps {
  show: boolean;
  rocket?: Race2Uranus.RocketStructOutput;
  raceId?: BigNumberish;
}

function Winner({ show, rocket, raceId }: IProps) {
  const { account } = useEthers();
  const { contract } = useRaceContract();
  const [animate, setAnimate] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hasReward, setHasReward] = useState(false);

  useEffect(() => {
    if (!show) {
      setAnimate(true);
    }
  }, [show]);

  useEffect(() => {
    if (raceId && show && account && contract && rocket) {
      checkRewards();
    }

    async function checkRewards() {
      const [amount] = await contract!.functions.getStakeAmountForStaker(raceId!, rocket!.id, account!);

      setHasReward(amount.gt(0));
      setLoaded(true);
    }
  }, [account, contract, raceId, rocket, show]);

  useEffect(() => {
    const winnerSound = howl('race-win.mp3');
    const loserSound = howl('race-lose.mp3');

    let timeout = animate ? FINAL_APPROACH_SECONDS * SECOND_MILLIS : 0;

    if (show) {
      const timeoutId = setTimeout(() => {
        hasReward ? winnerSound.play() : loserSound.play();
      }, timeout);

      return () => clearTimeout(timeoutId);
    }
  }, [animate, hasReward, loaded, show]);

  return (
    <Container className={cn({ show, animate })}>
      <Layout>
        <Content>
          <RocketWrapper>
            <Rocket className="rocket" animate address={rocket?.nft} nftId={rocket?.nftId} />
          </RocketWrapper>
          {loaded && (
            <Description>
              <Typography.Title level={1} className="title">
                {hasReward ? '🎉 Congratulations!' : '🍭 Better luck next time!'}
              </Typography.Title>
              <div>
                The Winner is{' '}
                <strong className="orange">
                  <NftName address={rocket?.nft!} id={rocket?.nftId!} />
                </strong>
                !
              </div>
              {hasReward && (
                <div>
                  You can use the <strong>💰 Claim</strong> button above to get your rewards!
                </div>
              )}
              <br />
              <div>
                Join another Race to Uranus <Link to="/">here</Link>!
              </div>
            </Description>
          )}
        </Content>
      </Layout>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  display: none;

  &.show {
    display: block;
  }

  &.animate {
    opacity: 0;
    animation: appear ${FINAL_APPROACH_SECONDS}s ease forwards;
  }

  @keyframes appear {
    0% {
      opacity: 0;
    }
    90% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Content = styled.div``;

const RocketWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 45%;

  .rocket {
    width: 120px;
  }
`;

const Description = styled.div`
  position: absolute;
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .orange {
    color: ${orange};
  }
`;

export default Winner;
