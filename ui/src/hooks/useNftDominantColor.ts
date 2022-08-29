import { BigNumberish } from 'ethers';

import { useDominantColor } from './useDominantColor';
import { useNftImageUrl } from './useNftImageUrl';

export function useNftDominantColor(address: string, id: BigNumberish) {
  const { url } = useNftImageUrl(address, id);
  const { color, error, loading } = useDominantColor(url);

  return {
    color,
    loading,
    error,
  };
}
