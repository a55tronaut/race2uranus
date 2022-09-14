import { useEffect, useState } from 'react';

export function useWaitUntil(timestamp: number) {
  const [reached, setReached] = useState(false);

  useEffect(() => {
    if (timestamp) {
      const diff = timestamp - Date.now();
      if (diff > 0) {
        const timeoutId = setTimeout(() => setReached(true), diff);
        return () => clearTimeout(timeoutId);
      } else {
        setReached(true);
      }
    }
  }, [timestamp]);

  return reached;
}
