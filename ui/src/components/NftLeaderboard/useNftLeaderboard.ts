import { useCallback, useEffect, useState } from 'react';

import { race2UranusApi } from '../../api';
import { INftLeaderboardResult } from '../../types';

export function useNftLeaderboard() {
  const [items, setItems] = useState<INftLeaderboardResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const refreshItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await race2UranusApi.getNftLeaderboard();
      setItems(res);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading, error, refreshItems };
}
