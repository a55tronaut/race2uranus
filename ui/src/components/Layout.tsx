import styled from 'styled-components';

interface IProps {
  children: React.ReactNode;
}

function Layout({ children }: IProps) {
  return <Container>{children}</Container>;
}

const Container = styled.div`
  width: 100%;
  min-width: 1280px;
  height: 100vh;
  background-image: url(/assets/background.svg);
  background-position: center top;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
`;

export default Layout;
