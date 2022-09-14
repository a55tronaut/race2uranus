import styled from 'styled-components';

import StakeOnRocket from '../StakeOnRocket';
import Logo from './Logo';
import RewardPool from './RewardPool';
import EnterRace from '../EnterRace';
import BurMenu from './BurMenu';
import ClaimRewards from './ClaimRewards';
import EtaToUranus from './EtaToUranus';

function Header() {
  return (
    <Wrapper>
      <Container>
        <Content>
          <div className="space">
            <StakeOnRocket />
            <EtaToUranus className="eta" />
            <RewardPool />
          </div>
          <Logo />
          <div className="space right">
            <ClaimRewards className="claim" />
            <EnterRace />
            <BurMenu />
          </div>
        </Content>
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

  .space {
    display: flex;
    flex-direction: row;
    align-items: center;

    .eta {
      margin-left: 70px;
    }

    .claim {
      margin-right: 70px;
    }
  }
`;

const Content = styled.div`
  max-width: 1280px;
  margin: 0px auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 120px;
  padding: 0 30px;

  .logo {
    height: 115px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 8px;
  }
`;

export default Header;
