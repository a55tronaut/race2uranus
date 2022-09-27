import { Typography } from 'antd';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { useMemo } from 'react';

import { Race2Uranus } from '../../types';
import MagicAmount from '../MagicAmount';
import { EnterRaceButton } from '../EnterRace';

const { Title } = Typography;

interface IProps {
  show: boolean;
  race: Race2Uranus.RaceStructOutput;
}

function PreRace({ show, race }: IProps) {
  const rewardPool = useMemo(() => {
    const maxRacerStake = race?.configSnapshot.maxStakeAmount.mul(race?.configSnapshot.maxRockets);
    const currentPool = race?.rewardPool;

    if (maxRacerStake && currentPool) {
      return currentPool.gt(maxRacerStake) ? currentPool : maxRacerStake;
    }

    return 0;
  }, [race?.configSnapshot.maxRockets, race?.configSnapshot.maxStakeAmount, race?.rewardPool]);

  return (
    <Container>
      <CSSTransition in={show} timeout={500} classNames="welcome" unmountOnExit>
        <Content>
          <Title level={2} className="title">
            Welcome To The Launch Pad!
          </Title>
          <span className="subtitle">
            You are about to enter the <strong>Race to Uranus</strong>:
          </span>
          <ul className="list">
            <li>
              Click the <strong>🚀 Enter Race</strong> button to put your NFT into a rocket and earn a{' '}
              <strong>guaranteed</strong> share of the reward pool!
            </li>
            <li>
              No NFTs? No problem! Simply click the <strong>✨ Stake</strong> button to stake on anyone's rocket!
            </li>
            <li>
              You can also <strong>🔥 Boost</strong> any rocket's propulsion system with your <strong>$MAGIC</strong>!
            </li>
          </ul>
          <span>
            Be sure to join our community on{' '}
            <a href="https://discord.gg/TdkFpqnAch" rel="noreferrer" target="_blank">
              <img className="discord" src="/assets/discord.svg" alt="Discord" /> Discord
            </a>
            !
          </span>
          <div className="poolBg">
            <Title level={5} className="poolHeader">
              Join to Earn Up To
            </Title>
            <MagicAmount amount={rewardPool} />
          </div>
          <br />
          <br />
          <EnterRaceButton />
        </Content>
      </CSSTransition>
    </Container>
  );
}

const Container = styled.div`
  .welcome-enter {
    opacity: 0;
  }
  .welcome-enter-active {
    opacity: 1;
    transition: opacity 0.5s ease;
  }
  .welcome-enter-done {
    opacity: 1;
  }
  .welcome-exit {
    opacity: 1;
  }
  .welcome-exit-active {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .welcome-exit-done {
    opacity: 0;
  }
`;

const Content = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 800px;
  text-align: center;

  .title {
    margin-bottom: 36px;
  }

  .subtitle {
    font-size: 18px;
  }

  .list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 24px;
    text-align: center;
    line-height: 200%;
  }

  .discord {
    width: 18px;
  }

  .poolBg {
    margin-top: 42px;
    padding: 4px 72px 6px 72px;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(96, 0, 198, 0.6) 50%, rgba(0, 0, 0, 0) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: scale(1.8);
  }

  .poolHeader {
    transform: scale(0.6);
    margin: 0;
  }
`;

export default PreRace;
