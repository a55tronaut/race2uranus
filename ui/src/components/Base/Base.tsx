import styled from 'styled-components';

function Base() {
  return (
    <SpaceBase>
      <div className="grad2"></div>
      <div className="grad1"></div>
      <img alt="base" className="base" src={'../assets/base.svg'} />
    </SpaceBase>
  );
}

const SpaceBase = styled.div`
  .base {
    width: 1920px;
    position: absolute;
    bottom: 0;
    z-index: 1;
    right: 50%;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .grad1 {
    height: 10px;
    width: 100%;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
    position: absolute;
    bottom: 50px;
    z-index: 1;
  }

  .grad2 {
    height: 60px;
    width: 100%;
    background-image: linear-gradient(to right, rgba(97, 0, 125, 1), rgba(41, 0, 87, 1));
    position: absolute;
    bottom: 0;
    z-index: 1;
  }
`;

export default Base;
