import styled from 'styled-components';

function Tracks() {
  return (
    <Layout>
      <AllTracks>
        <div className="track" />
        <div className="trackSecond" />
        <div className="track" />
        <div className="trackFirst" />
        <div className="track" />
        <div className="track" />
        <div className="trackThird" />
        <div className="track" />
      </AllTracks>
    </Layout>
  );
}

const Layout = styled.div`
  max-width: 1280px;
  margin: 0px auto;
`;

const AllTracks = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: row;

  .track {
    height: 50vh;
    width: 120px;
    background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1));
    margin: auto auto 0;
  }

  .trackFirst {
    height: 50vh;
    width: 120px;
    background-image: linear-gradient(rgba(0, 155, 255, 0), rgba(0, 155, 255, 0.5));
    margin: auto auto 0;
  }

  .trackSecond {
    height: 50vh;
    width: 120px;
    background-image: linear-gradient(rgba(164, 0, 170, 0), rgba(164, 0, 170, 0.5));
    margin: auto auto 0;
  }

  .trackThird {
    height: 50vh;
    width: 120px;
    background-image: linear-gradient(rgba(96, 0, 198, 0), rgba(96, 0, 198, 0.5));
    margin: auto auto 0;
  }
`;

export default Tracks;
