import { useEffect, useState } from 'react';

import { IRaceStatusMeta } from '../types';

export function useRaceMetaWitness(statusMeta?: IRaceStatusMeta) {
  const [seenWaiting, setSeenWaiting] = useState(false);
  const [seenInProgress, setSeenInProgress] = useState(false);
  const [seenRevealBlockHidden, setSeenRevealBlockHidden] = useState(false);
  const [seenPreDone, setSeenPreDone] = useState(false);

  useEffect(() => {
    if (statusMeta?.waiting) {
      setSeenWaiting(true);
    }
  }, [statusMeta?.waiting]);

  useEffect(() => {
    if (statusMeta?.inProgress) {
      setSeenInProgress(true);
    }
  }, [statusMeta?.inProgress]);

  useEffect(() => {
    if (statusMeta?.revealBlockReached === false) {
      setSeenRevealBlockHidden(true);
    }
  }, [statusMeta?.revealBlockReached]);

  useEffect(() => {
    if (statusMeta?.done === false) {
      setSeenPreDone(true);
    }
  }, [statusMeta?.done]);

  return { seenWaiting, seenInProgress, seenRevealBlockHidden, seenPreDone };
}
