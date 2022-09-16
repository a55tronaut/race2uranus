import { BigNumberish } from 'ethers';

import { useDominantColor } from './useDominantColor';
import { useNftMeta } from './useNftMeta';

export function useNftDominantColor(address?: string, id?: BigNumberish) {
  const { meta } = useNftMeta(address, id);
  const { color, error, loading } = useDominantColor(meta?.url);

  return {
    color,
    loading,
    error,
  };
}
