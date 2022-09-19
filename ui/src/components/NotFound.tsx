import { Typography } from 'antd';
import styled from 'styled-components';

function NotFound() {
  return (
    <NotFoundWrapper>
      <Typography.Title className="message">Not found</Typography.Title>
    </NotFoundWrapper>
  );
}
const NotFoundWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px;

  .message {
    font-weight: 300;
  }
`;

export default NotFound;
