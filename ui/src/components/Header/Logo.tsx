import { Link } from 'react-router-dom';
import styled from 'styled-components';

function Logo() {
  return (
    <Container>
      <Link to="/">
        <img alt="logo" className="logo" src="/assets/logo.svg" />
      </Link>
    </Container>
  );
}

const Container = styled.div`
  .logo {
    height: 115px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0.5em;
  }
`;

export default Logo;
