import { Radio } from 'antd';
import styled from 'styled-components';

import { Race2Uranus } from '../../types';
import Rocket from '../Rocket';

interface IProps {
  rockets: Race2Uranus.RocketStructOutput[];
  onSelect: (rocket: Race2Uranus.RocketStructOutput) => void;
}

function RocketPicker({ rockets, onSelect }: IProps) {
  console.log(rockets);

  return (
    <Container>
      <Radio.Group>
        {rockets.map((rocket) => (
          <Radio value={rocket.id}>
            <Rocket nftId={rocket.nftId} address={rocket.nft} />
          </Radio>
        ))}
      </Radio.Group>
    </Container>
  );
}

const Container = styled.div`
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

export default RocketPicker;
