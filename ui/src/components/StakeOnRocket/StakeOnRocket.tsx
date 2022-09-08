import { useCallback, useEffect, useState } from 'react';
import { Button, Modal } from 'antd';

import { useSelectedRace } from '../../hooks';
import StakeOnRocketModalContent from './StakeOnRocketModalContent';

function StakeOnRocket() {
  const race = useSelectedRace();
  const [showModal, setShowModal] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleShowModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  useEffect(() => {
    const _disabled = !race || race.rockets?.length === race.configSnapshot?.maxRockets;
    setDisabled(_disabled);
  }, [race]);

  return (
    <>
      <Button type="primary" size="large" disabled={disabled} ghost onClick={handleShowModal}>
        Stake
      </Button>
      <Modal centered open={showModal} width={650} destroyOnClose onCancel={handleCloseModal} footer={null}>
        <StakeOnRocketModalContent onClose={handleCloseModal} />
      </Modal>
    </>
  );
}

export default StakeOnRocket;
