import { useCallback, useState } from 'react';
import { Button, Modal } from 'antd';
import styled from 'styled-components';

import { Race2Uranus } from '../../types';
import BoostRocketModalContent from './BoostRocketModalContent';

interface IProps {
  rocket: Race2Uranus.RocketStructOutput;
  className?: string;
}

function BoostRocket({ rocket, className }: IProps) {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <Container className={className}>
      <Button type="primary" size="large" disabled={!rocket} ghost onClick={handleShowModal}>
        Boost
      </Button>
      <Modal centered open={showModal} width={650} destroyOnClose onCancel={handleCloseModal} footer={null}>
        <BoostRocketModalContent rocket={rocket} onClose={handleCloseModal} />
      </Modal>
    </Container>
  );
}

const Container = styled.div``;

export default BoostRocket;
