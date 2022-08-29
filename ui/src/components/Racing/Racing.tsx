import { useEffect } from 'react';
import styled from 'styled-components';
import $ from 'jquery';

import { raceTotalDur, totalRockets, minHeight, maxHeight, finalStanding } from '../../constants';
import { randomHeight } from '../../utils';

function Racing() {
  function countDownAnimation() {
    const cdElement = document.getElementById('countdown')!;
    cdElement.style.display = 'flex';
    setTimeout(() => {
      $('.countdown').hide();
      $('.boostBtn').show();
      raceAnimation(raceTotalDur);
    }, 6 * 1000);
  }

  function raceAnimation(raceAnimDur: number) {
    setInterval(function () {
      let curentStanding = [];

      if (raceAnimDur > 2) {
        for (let i = 1; i < totalRockets + 1; i++) {
          $('#rocket-' + i).animate({ top: randomHeight(minHeight, maxHeight) }, 2000);
        }
        raceAnimDur--;
        localStorage.setItem('totalLeftDur', String(raceAnimDur));

        for (let i = 1; i < totalRockets + 1; i++) {
          let top: any = {};
          top.num = parseInt($('#rocket-' + i).css('top'));
          top.id = i;
          curentStanding.push(top);
        }

        function calcCurrOrder(standing: any[]) {
          standing.sort(function (a, b) {
            return a.num < b.num ? -1 : a.num === b.num ? 0 : 1;
          });
          return standing;
        }

        calcCurrOrder(curentStanding);

        if (raceAnimDur < 3) {
          localStorage.removeItem('totalLeftDur');
          sortRockets();
        }
      }
    }, 1000);
  }

  function sortRockets() {
    for (let i = 0; i < finalStanding.length; i++) {
      $('.rocket' + finalStanding[i]).css({
        top: 60 * (i + 1),
      });
    }
    let html = '';
    for (let j = 0; j < finalStanding.length; j++) {
      html += '<li>' + finalStanding[j] + '</li>';
    }
    $('.num-center ul').html(html);
    $('.rocket').stop(true, false);
    $('.topbg').stop(true, false);
  }

  useEffect(() => {
    countDownAnimation();
  }, []);

  return (
    <Container>
      <div className="countdown" id="countdown"></div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  .countdown {
    display: none;
    position: relative;
    z-index: 8;
    width: 636px;
    height: 650px;
    background: url(../../assets/countdown.gif);
    margin-left: auto;
    margin-right: auto;
  }

}
`;

export default Racing;
