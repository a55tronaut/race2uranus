import { Typography } from 'antd';
import { BigNumber } from 'ethers';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import MagicAmount from '../MagicAmount';

const { Title, Paragraph } = Typography;

interface IProps {
  show: boolean;
  rewardPool: BigNumber;
}

function PreRace({ show, rewardPool }: IProps) {
  return (
    <Container>
      <CSSTransition in={show} timeout={500} classNames="welcome" unmountOnExit>
        <Content>
          <Title level={2} className="title">
            Welcome To The Launch Pad!
          </Title>
          <Paragraph className="paragraph">
            You are about to enter the <strong>Race to Uranus</strong>.
            <br />
            Click the <strong>Enter Race</strong> button to join the race and earn a <strong>guaranteed</strong> share
            of the reward pool!
            <br />
            You can also <strong>Stake</strong> on any rocket or <strong>Boost</strong> its propulsion system with your{' '}
            <strong>$MAGIC</strong>!
          </Paragraph>
          <div className="poolBg">
            <Title level={5} className="poolHeader">
              Join to Earn Up To
            </Title>
            <MagicAmount amount={rewardPool} />
          </div>
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
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 800px;

  .title {
    margin-bottom: 36px;
  }

  .paragraph {
    text-align: center;
    line-height: 200%;
  }

  .poolBg {
    margin-top: 36px;
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
