import styled from 'styled-components';
import { Typography } from 'antd';

import { blue } from '../colors';

const { Title, Paragraph } = Typography;

function Lore() {
  return (
    <Container>
      <Title level={2} className="title">
        Race to Uranus
      </Title>
      <Title level={5} className="chapterTitle">
        Chapter 1
      </Title>
      <Paragraph>An overseer was silently observing every happening in the Treasure Metaverse.</Paragraph>
      <Paragraph>
        Being able to look into the past, present and future. He first looked back to the past, times were simple back
        then, Legions hunting for treasures, toads chopping wood, Battleflies drinking nectar, donkeys harvesting
        carrots, Smols doing.. Smol things.
      </Paragraph>
      <Paragraph>
        But in the future, everything is not as simple, the scarcity of MAGIC has reached record high. As the battle for
        MAGIC raged on, desperation set in and chaos ensued. The watcher, once a silent overseer, wanting to intervene,
        thinks of a peaceful solution to glory. “Should I introduce metaversal travel, so they can live together in
        peace? No.. this will just introduce chaos faster than before.” He knew introducing future technologies will
        just further complicate this timeline.
      </Paragraph>
      <Paragraph>
        He then thought of an idea, a crazy one. A Race.. A race through the metaverse! He even thought of the perfect
        finish line.
      </Paragraph>
      <Paragraph>
        The watcher selected the first champions in the first race, and everyone did rocket racing ever since. Peace was
        finally achieved.
      </Paragraph>
      <Paragraph>
        Now, everyone can now use MAGIC as a way to wager for their champion, winner takes all! Now, everynight,
        onlookers gaze into the stars waiting for their champion to pass.
      </Paragraph>
      <Paragraph>
        Seeing shooting stars in the night sky, the Donkey asked the village elder, “Are they going to the moon?”
      </Paragraph>
      <Paragraph>“No, silly, they’re going to Uranus.”</Paragraph>
      <Paragraph>“I want to be in Uranus too!” said the Donkey.</Paragraph>
      <Paragraph>“Me too, me too”</Paragraph>

      <Title level={5} className="chapterTitle">
        Chapter 2
      </Title>
      <Paragraph>
        Founder of the race a scam? Story is make believe, we’re just milking everyone’s money with this story.
      </Paragraph>
      <Paragraph>
        Real story, it was only supposed to be a battle for glory to distract everyone from fighting for MAGIC, but
        people started using wagered rocket races to win MAGIC from neighboring metaverses!
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

  .ant-typography.title,
  .ant-typography.chapterTitle {
    text-align: center;
  }

  .chapterTitle {
    text-transform: uppercase;
    color: ${blue};
  }
`;

export default Lore;
