import { useCallback, useMemo, useState } from 'react';
import { Button, Modal, Tooltip } from 'antd';

import { useSelectedRace } from '../../hooks';
import { Race2Uranus } from '../../types';
import MagicAmount from '../MagicAmount';
import StakeOnRocketModalContent from './StakeOnRocketModalContent';

interface IProps {
  className?: string;
  emojiOnly?: boolean;
  rocket?: Race2Uranus.RocketStructOutput;
}

function StakeOnRocket({ className, emojiOnly, rocket }: IProps) {
  const { race, statusMeta, refresh } = useSelectedRace();
  const [showModal, setShowModal] = useState(false);
  const disabled = !race || race?.rockets.length === 0 || statusMeta?.revealBlockReached;

  const tooltipTitle = useMemo(() => {
    if (rocket?.totalStake.gt('0')) {
      return (
        <div style={{ textAlign: 'center' }}>
          Stake! Sum of all stakes:
          <br />
          <MagicAmount amount={rocket.totalStake} duration={0} size={5} />
        </div>
      );
    }

    return 'Stake!';
  }, [rocket?.totalStake]);

  const handleShowModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      <Tooltip title={tooltipTitle} placement="top" open={emojiOnly ? undefined : false}>
        <Button
          className={className}
          type="primary"
          size="large"
          disabled={disabled}
          style={{ visibility: disabled ? 'hidden' : 'visible' }}
          ghost
          onClick={handleShowModal}
        >
          ✨{!emojiOnly && ' Stake'}
        </Button>
      </Tooltip>
      <Modal centered open={showModal} width={650} destroyOnClose onCancel={handleCloseModal} footer={null}>
        <StakeOnRocketModalContent rocket={rocket} onClose={handleCloseModal} refresh={refresh} />
      </Modal>
    </>
  );
}

export default StakeOnRocket;
