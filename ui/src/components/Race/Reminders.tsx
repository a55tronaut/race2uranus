import { useEffect, useRef } from 'react';
import { notification } from 'antd';
import { BigNumberish } from 'ethers';
import moment from 'moment';

import { MINUTE_MILLIS, SECOND_MILLIS } from '../../constants';
import { useTimeToL1Block } from '../../hooks';

interface IProps {
  enabled: boolean;
  revealBlockNumber: BigNumberish;
}

function Reminders({ enabled, revealBlockNumber }: IProps) {
  const { timestamp } = useTimeToL1Block(revealBlockNumber);
  const timestampRef = useRef(timestamp);

  useEffect(() => {
    timestampRef.current = timestamp;
  }, [timestamp]);

  useEffect(() => {
    let timeoutId: NodeJS.Timer;

    if (enabled) {
      timeoutId = setTimeout(showRemindersPeriodically, 10 * SECOND_MILLIS);

      function showRemindersPeriodically() {
        if (!document.hidden) {
          notification.info({
            message: (
              <span>
                You only have <strong>{moment(timestampRef.current).toNow(true)}</strong> left to{' '}
                <strong>✨ Stake</strong> on your favorite rocket or <strong>🔥 Boost</strong> its propulsion system!
              </span>
            ),
          });
        }

        timeoutId = setTimeout(showRemindersPeriodically, 2 * MINUTE_MILLIS);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [enabled]);

  return <div />;
}

export default Reminders;
