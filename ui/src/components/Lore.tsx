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
                <Title level={1}>Lore</Title>
                <Text className="txtChapter">Chapter 1</Text>
              </div>
              <br />
              <Paragraph className="txtBody">
                An overseer was silently observing every happening in the Treasure Metaverse.
              </Paragraph>
              <Paragraph className="txtBody">
                Being able to look into the past, present and future. He first looked back to the past, times were
                simple back then, Legions hunting for treasures, toads chopping wood, Battleflies drinking nectar,
                donkeys harvesting carrots, Smols doing.. Smol things.
              </Paragraph>
              <Paragraph className="txtBody">
                But in the future, everything is not as simple, the scarcity of MAGIC has reached record high. As the
                battle for MAGIC raged on, desperation set in and chaos ensued. The watcher, once a silent overseer,
                wanting to intervene, thinks of a peaceful solution to glory. “Should I introduce metaversal travel, so
                they can live together in peace? No.. this will just introduce chaos faster than before.” He knew
                introducing future technologies will just further complicate this timeline.
              </Paragraph>
              <Paragraph className="txtBody">
                He then thought of an idea, a crazy one. A Race.. A race through the metaverse! He even thought of the
                perfect finish line.
              </Paragraph>
              <Paragraph className="txtBody">
                The watcher selected the first champions in the first race, and everyone did rocket racing ever since.
                Peace was finally achieved.
              </Paragraph>
              <Paragraph className="txtBody">
                Now, everyone can now use MAGIC as a way to wager for their champion, winner takes all! Now, everynight,
                onlookers gaze into the stars waiting for their champion to pass.
              </Paragraph>
              <Paragraph className="txtBody">
                Seeing shooting stars in the night sky, the Donkey asked the village elder, “Are they going to the
                moon?”
              </Paragraph>
              <Paragraph className="txtBody">“No, silly, they’re going to Uranus.”</Paragraph>
              <Paragraph className="txtBody">“I want to be in Uranus too!” said the Donkey.</Paragraph>
              <Paragraph className="txtBody">“Me too, me too”</Paragraph>
              <div className="titleCenter">
                <Text className="txtChapter">Chapter 2</Text>
              </div>
              <br />
              <Paragraph className="txtBody">
                Founder of the race a scam? Story is make believe, we’re just milking everyone’s money with this story.
              </Paragraph>
              <Paragraph className="txtBody">
                Real story, it was only supposed to be a battle for glory to distract everyone from fighting for MAGIC,
                but people started using wagered rocket races to win MAGIC from neighboring metaverses!
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
  width: 100%;
  background-position: center top;
  background-size: cover;
  background-repeat: no-repeat;
`;

const Layout = styled.div`
  max-width: 1280px;
  margin: 0px auto;
`;
const Container = styled.div`
  overflow: auto;
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
