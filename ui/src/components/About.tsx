import styled from 'styled-components';
import { Tooltip, Typography } from 'antd';

import { useRaceConfig } from '../hooks';
import WhitelistedNfts from './WhitelistedNfts';

const { Title, Paragraph } = Typography;

function About() {
  const { config } = useRaceConfig();

  return (
    <Container>
      <Title level={2} className="title">
        About
      </Title>
      <Paragraph>
        <strong>Race 2 Uranus</strong> is an on-chain racing game set in the{' '}
        <strong>
          <a href="https://treasure.lol/" rel="noreferrer" target="_blank">
            Treasure
          </a>
        </strong>{' '}
        metaverse that lets you turn your favorite <strong>Treasure NFTs</strong> into <i>Asstronauts</i> and
        participate in the glorious <strong>Race 2 Uranus</strong>!
      </Paragraph>
      <Paragraph>
        We created the game with interoperability in mind, combined with the CC0 nature of <strong>Treasure</strong>{' '}
        collections, it is possible to have them interact with each other and battle for glory! We have also released
        our tooling <strong>open-source</strong> for all <i>buildooors</i> in the <strong>Treasure</strong> ecosystem,
        check it out{' '}
        <a href="https://github.com/a55tronaut/race2uranus" rel="noreferrer" target="_blank">
          here
        </a>
        !
      </Paragraph>
      <Paragraph>
        There are <strong>two</strong> ways to win: Verify your{' '}
        <Tooltip
          title={
            <div>
              Depending on the race, it will be some subset of the following:
              <WhitelistedNfts whitelist={config?.whitelistedNfts} />
            </div>
          }
        >
          <strong>supported NFT</strong>
        </Tooltip>{' '}
        and stake <strong>$MAGIC</strong> to become an <i>Asstronaut</i>, or simply stake <strong>$MAGIC</strong> on an{' '}
        <i>Asstronaut</i> to become a believer!
      </Paragraph>
      <Paragraph>
        To join a race, simply press <strong>🚀 Enter Race</strong>. Once the empty rockets are filled up, the countdown
        to launch will begin! During this time, believers can stake <strong>$MAGIC</strong> on any of the{' '}
        <i>Asstronauts</i> at any time by clicking <strong>✨ Stake</strong>. You can also boost a rocket by clicking{' '}
        <strong>🔥 Boost</strong>! Be aware though, <strong>$MAGIC</strong> being used as rocket propulsion is still in
        its early stages and might end up backfiring!
      </Paragraph>
      <Paragraph>The rockets can only take off during optimal launch windows which occur once every hour!</Paragraph>
      <Paragraph>
        After the race, <strong>all</strong> <i>Asstronauts</i> get a <strong>guaranteed</strong> share of the pool,
        while the winning <i>Asstronaut</i> and its believers will split the rest of the pool based on the amount of{' '}
        <strong>$MAGIC</strong> that they have staked.
      </Paragraph>
      <Paragraph>
        Compete with other <i>Asstronauts</i> to become the first to step foot on <strong>Uranus</strong>! Show your
        favorite cartridge some love by repping your favorite <strong>$MAGIC</strong> <i>Asstronaut</i> now!
      </Paragraph>
      <br />
      <Paragraph>
        Still not sure what to do? Check out the instructional video below!
        <br />
        <br />
        <video width="1100" controls>
          <source src="/media/demo.mp4" type="video/mp4" />
        </video>
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

  .ant-typography {
    text-align: center;
  }
`;

export default About;
