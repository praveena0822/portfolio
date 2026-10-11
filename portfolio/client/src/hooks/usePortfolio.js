import { useCallback, useEffect, useState } from 'react';
import { portfolioApi, errorMessage } from '../services/api.js';

export function usePortfolio() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false); // free hosting can take ~30s to wake up

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    setSlow(false);
    const timer = setTimeout(() => setSlow(true), 4000);
    try {
      setData(await portfolioApi.get());
    } catch (e) {
      setError(errorMessage(e, 'Could not load the portfolio.'));
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, loading, slow, reload: load };
}
