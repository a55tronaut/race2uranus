import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface IProps {
  message: React.ReactNode;
  className?: string;
}

function InfoTooltip({ message, className }: IProps) {
  return (
    <Container className={className}>
      <Tooltip title={message}>
        <QuestionCircleOutlined />
      </Tooltip>
    </Container>
  );
}

const Container = styled.span`
  .anticon {
    cursor: pointer;
  }
`;

export default InfoTooltip;
