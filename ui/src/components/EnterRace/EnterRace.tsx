import { useCallback, useState } from 'react';
import { Button, Modal } from 'antd';

import { useSelectedRace } from '../../hooks';
import EnterRaceModalContent from './EnterRaceModalContent';

function EnterRace() {
  const { race, refresh } = useSelectedRace();
  const [showModal, setShowModal] = useState(false);
  const disabled = !race || race.rockets.length === race.configSnapshot.maxRockets;

  const handleShowModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      <Button type="primary" size="large" disabled={disabled} ghost onClick={handleShowModal}>
        🚀 Enter Race
      </Button>
      <Modal centered open={showModal} width={650} destroyOnClose onCancel={handleCloseModal} footer={null}>
        <EnterRaceModalContent onClose={handleCloseModal} refresh={refresh} />
      </Modal>
    </>
  );
}

export default EnterRace;
