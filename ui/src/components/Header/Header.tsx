import styled from 'styled-components';

import { Space } from 'antd';

import StakeButton from './StakeButton';
import StartCd from './StartCd';
import Logo from '../Logo';
import Prize from './Prize';
import EnterRace from './EnterRace';
import BurMenu from './BurMenu';

function Header() {
  return (
    <Wrapper>
      <Container>
        <Layout>
          <TopMenu>
            <div>
              <Space size="large">
                <StakeButton />
                <StartCd />
              </Space>
            </div>
            <Logo />
            <div className="push">
              <Space size="large">
                <Prize />
                <EnterRace />
              </Space>
            </div>
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
  .push {
    margin-left: auto;
    display: flex;
  }
  .logo {
    height: 115px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0.5em;
  }
`;

const Container = styled.div`
  background-image: url(../assets/menu.svg);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 155px;
`;

export default Header;
