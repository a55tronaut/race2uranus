import styled from 'styled-components';

import { useSelectedRace } from '../../hooks';
import LaunchWindow from './LaunchWindow';
import EtaToUranus from './EtaToUranus';

interface IProps {
  className?: string;
}

function Countdowns({ className }: IProps) {
  const { loading, statusMeta } = useSelectedRace();

  const component = statusMeta?.waiting && !statusMeta?.rosterFull ? <LaunchWindow /> : <EtaToUranus />;

  return <Container className={className}>{!loading && component}</Container>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 130px;
`;

export default Countdowns;
