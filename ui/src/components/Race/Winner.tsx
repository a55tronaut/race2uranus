import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GAME_LOOP_INTERVAL_SECONDS } from '../../constants';

import { Race2Uranus } from '../../types';
import Layout from '../Layout';
import Rocket from '../Rocket';

interface IProps {
  rocket: Race2Uranus.RocketStructOutput;
}

function Winner({ rocket }: IProps) {
  return (
    <Container>
      <Layout>
        <Content>
          <RocketWrapper>
            <Rocket className="rocket" address={rocket.nft} nftId={rocket.nftId} />
          </RocketWrapper>
          <Description>
            <Typography.Title level={1} className="title">
              Winner!
            </Typography.Title>
            <div>Congratulations to the owner and stakers! You can claim your rewards now!</div>
            <div>
              Everyone can join another Race to Uranus <Link to="/">here</Link>!
            </div>
          </Description>
        </Content>
      </Layout>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  opacity: 0;
  animation: appear ${3 * GAME_LOOP_INTERVAL_SECONDS}s ease forwards;

  @keyframes appear {
    0% {
      opacity: 0;
    }
    80% {
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
`;

export default Winner;