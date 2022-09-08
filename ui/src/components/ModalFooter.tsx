import styled from 'styled-components';
import { blue } from '../colors';

interface IProps {
  children: React.ReactNode;
  className?: string;
}

function ModalFooter({ children, className }: IProps) {
  return <Container className={className}>{children}</Container>;
}

const Container = styled.div`
  border-top: 1px solid ${blue};
  width: calc(100% + 48px);
  transform: translateX(-24px);
  margin-top: 24px;
  padding: 24px 24px 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default ModalFooter;
