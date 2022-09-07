import { useParams } from 'react-router-dom';

import { useRace } from './useRace';

export function useSelectedRace() {
  const { raceId } = useParams();
  const race = useRace(raceId!);

  return race;
}
