import { useCallback, useEffect, useState } from 'react';
import { Modal } from 'antd';

import { IRaceStatusMeta, Race2Uranus } from '../../types';
import DestroyAsteroidModalContent from './DestroyAsteroidModalContent';

interface IProps {
  race: Race2Uranus.RaceStructOutput;
  statusMeta: IRaceStatusMeta;
}

function DestroyAsteroid({ race, statusMeta }: IProps) {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  useEffect(() => {
    setShowModal(!!statusMeta?.revealBlockReached && !statusMeta?.done);
  }, [statusMeta?.done, statusMeta?.revealBlockReached]);

  return (
    <Modal centered open={showModal} width={650} destroyOnClose closable={false} footer={null}>
      <DestroyAsteroidModalContent race={race} onClose={handleCloseModal} />
    </Modal>
  );
}

export default DestroyAsteroid;
