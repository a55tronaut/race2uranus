import styled from 'styled-components';
import cn from 'classnames';

interface IProps {
  className?: string;
}

function Logo({ className }: IProps) {
  const classNames = cn('logo', className);

  return (
    <Container>
      <img alt="logo" className={classNames} src="/assets/logo.svg" />
    </Container>
  );
}

const Container = styled.div`
  margin: auto;
  display: block;

  .logo {
    height: 100px;
  }
`;

export default Logo;
