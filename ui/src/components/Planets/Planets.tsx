import styled from 'styled-components';

function Planets() {
  return (
    <AllPlanets>
      <img alt="planet" className="planet1" src={'../assets/planet1.svg'} />
      <img alt="planet" className="planet2" src={'../assets/planet2.svg'} />
    </AllPlanets>
  );
}

const AllPlanets = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;

  .planet1 {
    width: 360px;
    transform: translate(-70%, 50%);
}
  }

  .planet2 {
    width: 180px;
    transform: translate(480%, 10%);
}
  }
`;

export default Planets;
