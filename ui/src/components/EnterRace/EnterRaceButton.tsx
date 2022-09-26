import { Button } from 'antd';

import { useSelectedRace } from '../../hooks';
import { useEnterRaceModal } from './useEnterRaceModal';

function EnterRaceButton() {
  const { race } = useSelectedRace();
  const { open } = useEnterRaceModal();
  const disabled = !race || race.rockets.length === race.configSnapshot.maxRockets;

  return (
    <Button type="primary" size="large" disabled={disabled} ghost onClick={open}>
      🚀 Enter Race
    </Button>
  );
}

export default EnterRaceButton;
