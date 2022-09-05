import styled from 'styled-components';
import { Space } from 'antd';

import StakeButton from './StakeButton';
import StartCd from './StartCd';
import Logo from '../Logo';
import Prize from './Prize';
import EnterRace from './EnterRace';
import BurMenu from './BurMenu';
import ClaimRewards from './ClaimRewards';

function Header() {
  return (
    <Wrapper>
      <Container>
        <Layout>
          <TopMenu>
            <Space size="large">
              <StakeButton />
              <StartCd />
            </Space>
            <Logo />
            <Space size="large" className="spaceRight">
              <Prize />
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
  z-index: 1;
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
