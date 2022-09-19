import { useCallback, useState } from 'react';
import { Button, Modal } from 'antd';

import { useSelectedRace } from '../../hooks';
import StakeOnRocketModalContent from './StakeOnRocketModalContent';

function StakeOnRocket() {
  const { race, statusMeta, refresh } = useSelectedRace();
  const [showModal, setShowModal] = useState(false);
  const disabled = !race || race?.rockets.length === 0 || statusMeta?.revealBlockReached;

  const handleShowModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      <Button type="primary" size="large" disabled={disabled} ghost onClick={handleShowModal}>
        Stake
      </Button>
      <Modal centered open={showModal} width={650} destroyOnClose onCancel={handleCloseModal} footer={null}>
        <StakeOnRocketModalContent onClose={handleCloseModal} refresh={refresh} />
      </Modal>
    </>
  );
}

export default StakeOnRocket;
