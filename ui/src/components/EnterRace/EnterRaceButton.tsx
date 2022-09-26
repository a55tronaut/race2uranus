import { Button } from 'antd';

import { useSelectedRace } from '../../hooks';
import { useEnterRaceModal } from './useEnterRaceModal';

interface IProps {
  className?: string;
}

function EnterRaceButton({ className }: IProps) {
  const { race, statusMeta } = useSelectedRace();
  const { open } = useEnterRaceModal();
  const disabled = !race || !statusMeta?.waiting || race.rockets.length === race.configSnapshot.maxRockets;

  return (
    <Button
      type="primary"
      size="large"
      className={className}
      disabled={disabled}
      style={{ visibility: disabled ? 'hidden' : 'visible' }}
      ghost
      onClick={open}
    >
      🚀 Enter Race
    </Button>
  );
}

export default EnterRaceButton;
