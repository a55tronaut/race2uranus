import { useCallback, useState } from 'react';
import { Button, Modal } from 'antd';

import { useSelectedRace } from '../../hooks';
import EnterRaceModalContent from './EnterRaceModalContent';

function EnterRace() {
  const race = useSelectedRace();
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      <Button type="primary" size="large" disabled={!race} ghost onClick={handleShowModal}>
        Enter Race
      </Button>
      <Modal centered visible={showModal} width={650} destroyOnClose onCancel={handleCloseModal} footer={null}>
        <EnterRaceModalContent onClose={handleCloseModal} />
      </Modal>
    </>
  );
}

export default EnterRace;
