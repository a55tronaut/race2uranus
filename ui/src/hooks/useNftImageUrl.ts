import { BigNumberish } from 'ethers';
import { useEffect, useState } from 'react';

import { useNftImageUrls } from './useNftImageUrls';

// https://images.weserv.nl/
const proxyUrl = '//images.weserv.nl/?maxage=1w&w=200&url=';

export function useNftImageUrl(address?: string, id?: BigNumberish) {
  const { fetchImageUrl } = useNftImageUrls();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (address && id) {
      fetchUrl();
    }

    async function fetchUrl() {
      try {
        setLoading(true);
        const _url = await fetchImageUrl(address!, id!);
        setUrl(proxyUrl + _url.replace('https://', ''));
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  }, [address, fetchImageUrl, id]);

  return { url, loading, error };
}
