import { useEffect, useState } from 'react';
import { getCities } from './cityService';

export default function useCities() {
  const [result, setResult] = useState({ cities: [], isLoading: true, error: null });

  useEffect(() => {
    let isActive = true;
    getCities().then((cities) => {
      if (isActive) {
        setResult({ cities, isLoading: false, error: null });
      }
    }).catch((error) => {
      if (isActive) setResult({ cities: [], isLoading: false, error });
    });
    return () => { isActive = false; };
  }, []);

  return result;
}
