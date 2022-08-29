import styled from 'styled-components';
import { Typography, Space } from 'antd';

const { Text, Title, Paragraph } = Typography;

function Lore() {
  return (
    <Wrapper>
      <Layout>
        <Container>
          <ContainerTxt>
            <Space direction="vertical" size="middle">
              <div className="titleCenter">
                <Title level={1}>About</Title>
              </div>
              <br />
              <Paragraph className="txtBody">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque egestas mi in porttitor rutrum. Orci
                varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed feugiat nunc id
                tortor semper, non ornare sapien vulputate. Nunc pellentesque, leo sed semper suscipit, tellus magna
                luctus diam, ut consectetur eros ipsum ut purus. Vivamus commodo, dolor eu ultrices congue, orci sapien
                hendrerit erat, luctus consequat nulla justo eu ante. Morbi sit amet feugiat lorem, nec fringilla orci.
                Proin et nisl dictum, venenatis urna ac, facilisis sapien. Cras pellentesque arcu id elit iaculis, non
                ultricies erat porttitor. Morbi bibendum mauris nec lorem sagittis fringilla eu ac justo. Cras ultrices
                ante sit amet erat consectetur eleifend.
              </Paragraph>
            </Space>
          </ContainerTxt>
        </Container>
      </Layout>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-image: url(../assets/background.svg);
  width: 100vw;
  height: 100vh;
  background-position: center top;
  background-size: cover;
  background-repeat: no-repeat;
  position: fixed;
`;

const Layout = styled.div`
  max-width: 1280px;
  margin: 0px auto;
`;
const Container = styled.div`
  overflow: auto;
  max-height: 100vh;
  margin: 220px 30px 0;
`;

const ContainerTxt = styled.div`
  overflow-y: auto;
  margin-bottom: 220px;

  .titleCenter {
    text-align: center;
  }

  .txtChapter {
    font-size: 21px;
    text-transform: uppercase;
    color: #009bff;
  }

  .txtBody {
    font-size: 18px;
  }
`;

export default Lore;
