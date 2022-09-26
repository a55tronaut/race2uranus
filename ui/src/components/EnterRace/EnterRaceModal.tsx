import { Modal } from 'antd';

import { useSelectedRace } from '../../hooks';
import EnterRaceModalContent from './EnterRaceModalContent';
import { useEnterRaceModal } from './useEnterRaceModal';

function EnterRaceModal() {
  const { race } = useSelectedRace();
  const { show, close } = useEnterRaceModal();

  if (!race) {
    return <div />;
  }

  return (
    <Modal centered open={show} width={650} destroyOnClose onCancel={close} footer={null}>
      <EnterRaceModalContent />
    </Modal>
  );
}

export default EnterRaceModal;
