import { useCallback, useEffect, useState } from 'react';
import { getCities } from './cityService';

export default function useCities() {
  const [result, setResult] = useState({ cities: [], isLoading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);
  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    let isActive = true;
    setResult({ cities: [], isLoading: true, error: null });
    getCities().then((cities) => {
      if (isActive) {
        setResult({ cities, isLoading: false, error: null });
      }
    }).catch((error) => {
      if (isActive) setResult({ cities: [], isLoading: false, error });
    });
    return () => { isActive = false; };
  }, [reloadKey]);

  return { ...result, retry };
}
