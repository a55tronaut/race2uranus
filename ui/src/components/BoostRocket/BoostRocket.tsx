import { useCallback, useState } from 'react';
import { Button, Modal } from 'antd';

import { Race2Uranus } from '../../types';
import BoostRocketModalContent from './BoostRocketModalContent';

interface IProps {
  rocket: Race2Uranus.RocketStructOutput;
}

function BoostRocket({ rocket }: IProps) {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      <Button type="primary" size="large" disabled={!rocket} ghost onClick={handleShowModal}>
        Boost
      </Button>
      <Modal centered open={showModal} width={650} destroyOnClose onCancel={handleCloseModal} footer={null}>
        <BoostRocketModalContent rocket={rocket} onClose={handleCloseModal} />
      </Modal>
    </>
  );
}

export default BoostRocket;
