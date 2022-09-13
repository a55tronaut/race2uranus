import styled from 'styled-components';
import { Space } from 'antd';

import StakeOnRocket from '../StakeOnRocket';
import Logo from '../Logo';
import RewardPool from './RewardPool';
import EnterRace from '../EnterRace';
import BurMenu from './BurMenu';
import ClaimRewards from './ClaimRewards';
import EtaToUranus from './EtaToUranus';

function Header() {
  return (
    <Wrapper>
      <Container>
        <Layout>
          <TopMenu>
            <Space size="large">
              <StakeOnRocket />
              <EtaToUranus className="eta" />
            </Space>
            <Logo />
            <Space size="large" className="spaceRight">
              <RewardPool />
              <EnterRace />
              <ClaimRewardsContainer>
                <ClaimRewards />
              </ClaimRewardsContainer>
            </Space>
            <BurMenu />
          </TopMenu>
        </Layout>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  min-width: 1280px;
  z-index: 10;
`;

const Container = styled.div`
  background-image: url(../assets/menu.svg);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 155px;

  .spaceRight {
    position: relative;
  }

  .eta {
    margin-left: 70px;
  }
`;

const Layout = styled.div`
  max-width: 1280px;
  margin: 0px auto;
`;

const TopMenu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 120px;
  padding: 0 30px;

  .logo {
    height: 115px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0.5em;
  }
`;

const ClaimRewardsContainer = styled.div`
  position: absolute;
  bottom: -55px;
  right: 5px;
`;

export default Header;
