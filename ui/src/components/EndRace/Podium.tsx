import { useEffect } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import $ from 'jquery';

import { raceTotalDur, countDownSeconds } from '../../constants';

function Podium() {
  function showPodium() {
    $('.podium-bg').show();
    $('.rocket').hide();
    for (let i = 1; i < 4; i++) {
      document.getElementById('resPlace' + i)!.setAttribute('src', 'assets/rocket.svg');
    }
    $('.place1').animate({ left: '950px', top: '30px' }, 500);
    $('.place2').animate({ left: '550px', top: '200px' }, 500);
    $('.place3').animate({ left: '1350px', top: '200px' }, 500);
  }

  useEffect(() => {
    waitRaceComplete();

    function waitRaceComplete() {
      let phtFinishDur = raceTotalDur + countDownSeconds;
      const counter = setInterval(function () {
        if (phtFinishDur > 0) {
          phtFinishDur--;
        } else {
          clearInterval(counter);
          showPodium();
        }
      }, 1000);
    }
  }, []);

  return (
    <Container>
      <div className="podium-bg">
        <div className="place1">
          <img src="assets/podium/1st.svg" className="res" alt="pod1" />
          <img className="rocket1" id="resPlace1" alt="rck1"></img>
        </div>
        <div className="place2">
          <img src="assets/podium/2nd.svg" className="res" alt="pod2" />
          <img className="rocket2" id="resPlace2" alt="rck2"></img>
        </div>
        <div className="place3">
          <img src="assets/podium/3rd.svg" className="res" alt="pod3" />
          <img className="rocket3" id="resPlace3" alt="rck3"></img>
        </div>
        <Button className="claimBtn">CLAIM REWARD</Button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .podium-bg {
    position: absolute;
    top: 110px;
    display: none;
    width: 100%;
    height: 100%;
  }
  .claimBtn {
    left: 50%;
    transform: translateX(-50%);
    top: 65%;
    background-color: #0088ff;
    border: none;
    border-radius: 1px;
    box-shadow: 0px 0px 7px 28px #612cad;
    color: white;
    padding: 30px 40px;
    text-align: center;
    display: inline-block;
    font-size: 30px;
    line-height: 0;
  }

  .place1 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 226px;
  }
  .place2 {
    position: absolute;
    left: 25%;
    transform: translateX(-50%);
    width: 226px;
  }
  .place3 {
    position: absolute;
    left: 76%;
    transform: translateX(-50%);
    width: 226px;
  }

  .place-rocket {
    width: 150px;
    height: 300px;
  }
  .res {
    margin-left: 100px;
    width: 100px;
    height: 100px;
  }
  .rocket1 {
    width: 200px;
    height: 450px;
  }
  .rocket2 {
    width: 200px;
    height: 300px;
  }
  .rocket3 {
    width: 200px;
    height: 300px;
  }
`;

export default Podium;
