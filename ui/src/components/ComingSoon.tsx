import { Typography } from 'antd';
import styled from 'styled-components';

export function ComingSoon() {
  return (
    <Container>
      <Typography.Title>Coming Soon!</Typography.Title>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  backdrop-filter: blur(6px);
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

export default ComingSoon;
