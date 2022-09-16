import styled from 'styled-components';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

function About() {
  return (
    <Container>
      <Title level={2} className="title">
        About
      </Title>
      <Paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lobortis nulla sed est vulputate varius vel in
        odio. Nunc ut erat sit amet magna facilisis dictum at ut arcu. Duis elementum finibus rutrum. Mauris sit amet
        aliquam elit. Duis varius lacus nulla, eu auctor massa sodales quis. Duis tristique nunc metus, at molestie
        magna pharetra et. Vestibulum gravida purus sed odio ullamcorper laoreet. Morbi eu condimentum lacus. Morbi
        feugiat ut arcu a viverra. Nam tincidunt pretium diam, sed egestas elit imperdiet vel. Proin mollis nibh in diam
        lacinia, in dignissim arcu hendrerit. Sed ornare blandit nisl sed faucibus. Mauris molestie, diam vitae eleifend
        facilisis, nibh metus lacinia leo, a mollis eros nibh at nisi. Etiam ut porttitor ante.
      </Paragraph>
      <Paragraph>
        Suspendisse sit amet orci sed tellus consequat pretium. Integer a leo justo. Proin mauris ipsum, vulputate vitae
        ornare quis, sodales placerat ante. Fusce iaculis ex ac odio ullamcorper tempus. Suspendisse porta neque dolor,
        sit amet feugiat quam tristique sed. Proin eu odio et elit sodales tempus quis nec neque. Vivamus porta sem
        mauris, et tincidunt justo hendrerit in. Nulla in dictum enim. Pellentesque non tortor maximus, ornare leo ac,
        fermentum mauris. Cras fringilla ut dui at pretium. Mauris ut ornare diam. Cras diam neque, posuere nec nibh ut,
        ornare pharetra nisi. In auctor venenatis mollis. Nulla non mollis leo. Nam blandit non purus et auctor.
      </Paragraph>
    </Container>
  );
}

const Container = styled.div`
  max-width: 1280px;
  margin: 160px auto 32px auto;
  padding: 32px;
  display: flex;
  flex-direction: column;

  .ant-typography.title {
    text-align: center;
  }
`;

export default About;
