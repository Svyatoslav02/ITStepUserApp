import { useCallback, useEffect, useState } from 'react';
import { getPlace } from './cityService';

export default function usePlace(city, placeId, language = 'uk') {
  const [result, setResult] = useState({ place: null, isLoading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);
  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    let isActive = true;
    setResult({ place: null, isLoading: true, error: null });
    getPlace(city, placeId, language).then((place) => {
      if (isActive) setResult({ place, isLoading: false, error: null });
    }).catch((error) => {
      if (isActive) setResult({ place: null, isLoading: false, error });
    });
    return () => { isActive = false; };
  }, [city, placeId, language, reloadKey]);

  return { ...result, retry };
}
