import styled from 'styled-components';
import { Button } from 'antd';

import Rocket from './Rocket';

function Rockets() {
  return (
    <AllRockets>
      <RocketWrapper>
        <Rocket address="0xfeb5090f01a938ddAB67e1aDe885F90049a3DA84" id="127" />
        <Button type="primary" size="middle" ghost>
          Boost
        </Button>
      </RocketWrapper>
      <RocketWrapper>
        <Rocket address="0xfeb5090f01a938ddAB67e1aDe885F90049a3DA84" id="128" />
        <Button type="primary" size="middle" ghost>
          Boost
        </Button>
      </RocketWrapper>
      <RocketWrapper>
        <Rocket address="0xD115790C737A331f383fFe79A08AB913e54D2E31" id="123" />
        <Button type="primary" size="middle" ghost>
          Boost
        </Button>
      </RocketWrapper>
      <RocketWrapper>
        <img alt="rocket" className="rocket" src={'../assets/rocket.svg'} />
        <Button type="primary" size="middle" ghost>
          Boost
        </Button>
      </RocketWrapper>
      <RocketWrapper>
        <img alt="rocket" className="rocket" src={'../assets/rocket.svg'} />
        <Button type="primary" size="middle" ghost>
          Boost
        </Button>
      </RocketWrapper>
      <RocketWrapper>
        <img alt="rocket" className="rocket" src={'../assets/rocket.svg'} />
        <Button type="primary" size="middle" ghost>
          Boost
        </Button>
      </RocketWrapper>
      <RocketWrapper>
        <img alt="rocket" className="rocket" src={'../assets/rocket.svg'} />
        <Button type="primary" size="middle" ghost>
          Boost
        </Button>
      </RocketWrapper>
      <RocketWrapper>
        <img alt="rocket" className="rocket" src={'../assets/rocket.svg'} />
        <Button type="primary" size="middle" ghost>
          Boost
        </Button>
      </RocketWrapper>
    </AllRockets>
  );
}

const AllRockets = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 30%;
`;

const RocketWrapper = styled.div`
  width: 120px;
  margin: 0 20px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;

  .rocket {
    width: 80px;
    margin: 0 auto 1em;
  }
`;

export default Rockets;
