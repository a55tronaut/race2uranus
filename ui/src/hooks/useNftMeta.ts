import { BigNumberish } from 'ethers';
import { useEffect, useState } from 'react';

import { useNftMetas } from './useNftMetas';
import { INftMeta } from './useNftMetaStorage';

// https://images.weserv.nl/
const proxyUrl = '//images.weserv.nl/?maxage=1w&w=200&url=';

export function useNftMeta(address?: string, id?: BigNumberish) {
  const { fetchMeta } = useNftMetas();
  const [meta, setMeta] = useState<INftMeta>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (address && id) {
      load();
    }

    async function load() {
      try {
        setLoading(true);
        const res = await fetchMeta(address!, id!);
        setMeta({
          ...res,
          url: proxyUrl + res.url.replace('https://', ''),
        });
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  }, [address, fetchMeta, id]);

  return { meta, loading, error };
}
