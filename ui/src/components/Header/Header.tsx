import styled from 'styled-components';

import { useSelectedRace } from '../../hooks';
import StakeOnRocket from '../StakeOnRocket';
import { EnterRaceButton } from '../EnterRace';
import Logo from './Logo';
import RewardPool from './RewardPool';
import BurMenu from './BurMenu';
import ClaimRewards from './ClaimRewards';
import Countdowns from './Countdowns';

function Header() {
  const { race } = useSelectedRace();
  const hasRace = !!race;

  return (
    <Wrapper>
      <Container>
        <Backdrop>
          <Content>
            <div className="space">
              {hasRace && <Countdowns className="countdowns" />}
              {hasRace && <RewardPool className="rewardPool" />}
              <ClaimRewards />
            </div>
            <Logo />
            <div className="space right">
              {hasRace && <EnterRaceButton className="enterRace" />}
              {hasRace && <StakeOnRocket />}
              <BurMenu />
            </div>
          </Content>
        </Backdrop>
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
    &.right {
      justify-content: flex-end;
    }

    .countdowns {
      margin-right: 30px;
    }

    .enterRace {
      margin-right: 30px;
    }

    .claim {
      margin-right: 70px;
    }
  }
`;

const Backdrop = styled.div`
  width: 100%;
  height: 120px;
  backdrop-filter: blur(10px);
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
