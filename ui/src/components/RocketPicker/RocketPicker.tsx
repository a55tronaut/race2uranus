import { Radio } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Race2Uranus } from '../../types';
import Rocket from '../Rocket';

interface IProps {
  rockets: Race2Uranus.RocketStructOutput[];
  value?: Race2Uranus.RocketStructOutput;
  onChange?: (rocket: Race2Uranus.RocketStructOutput) => void;
}

// https://ant.design/components/form/#components-form-demo-customized-form-controls
function RocketPicker({ rockets, value, onChange }: IProps) {
  const [selectedRocket, setSelectedRocket] = useState<Race2Uranus.RocketStructOutput>();

  const updateSelectedRocket = useCallback(
    (rocket: Race2Uranus.RocketStructOutput) => {
      setSelectedRocket(value || rocket);
    },
    [value]
  );

  const handleRocketChange = useCallback(
    (e: any) => {
      const id = Number(e.target.value);
      const rocket = rockets[id];
      updateSelectedRocket(rocket);
      onChange && onChange(rocket);
    },
    [onChange, rockets, updateSelectedRocket]
  );

  useEffect(() => {
    updateSelectedRocket(selectedRocket!);
  }, [selectedRocket, updateSelectedRocket]);

  return (
    <Container>
      <Radio.Group onChange={handleRocketChange}>
        {rockets.map((rocket) => (
          <RadioWrapper key={rocket.id}>
            <Radio value={rocket.id}>
              <Rocket className="rocket" nftId={rocket.nftId} address={rocket.nft} />
            </Radio>
          </RadioWrapper>
        ))}
      </Radio.Group>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;

  .ant-radio-group {
    display: flex;
    flex-direction: row;
  }
`;

const RadioWrapper = styled.div`
  .ant-radio-wrapper {
    filter: grayscale(0.85);
    transition: filter 0.2s ease;
    margin: 8px;

    &:hover,
    &.ant-radio-wrapper-checked {
      filter: grayscale(0);
    }
  }

  .ant-radio {
    display: none;
  }

  .rocket {
    width: 40px;
  }
`;

export default RocketPicker;
