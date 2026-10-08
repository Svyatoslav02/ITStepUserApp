import { useEffect, useState } from 'react';
import { getCategories, getCityContent, getCityHistory, getPlaces } from './cityService';

export default function useCityData(city, language = 'uk') {
  const [result, setResult] = useState({ data: null, categories: [], isLoading: true, error: null });

  useEffect(() => {
    let isActive = true;
    setResult({ data: null, categories: [], isLoading: true, error: null });

    Promise.all([
      getCategories(language),
      getPlaces(city, language),
      getCityHistory(city, language),
      getCityContent(city, language),
    ]).then(([categories, places, history, content]) => {
      if (isActive) {
        setResult({
          categories,
          data: { ...content, places, history },
          isLoading: false,
          error: null,
        });
      }
    }).catch((error) => {
      if (isActive) setResult({ data: null, categories: [], isLoading: false, error });
    });

    return () => { isActive = false; };
  }, [city, language]);

  return result;
}
