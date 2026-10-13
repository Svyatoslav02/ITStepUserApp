import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_PLACES_KEY = 'savedPlaces';

export const getSavedPlaceKey = (city, placeId) => JSON.stringify([city, String(placeId)]);

export default function useSavedPlaces() {
  const [savedPlaceKeys, setSavedPlaceKeys] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const savedPlaceKeysRef = useRef(new Set());
  const persistenceQueueRef = useRef(Promise.resolve());

  useEffect(() => {
    let isActive = true;
    AsyncStorage.getItem(SAVED_PLACES_KEY)
      .then((storedValue) => {
        let keys = [];
        try {
          const parsedValue = storedValue ? JSON.parse(storedValue) : [];
          if (Array.isArray(parsedValue)) keys = parsedValue.filter((key) => typeof key === 'string');
        } catch {
          keys = [];
        }
        if (!isActive) return;
        const next = new Set(keys);
        savedPlaceKeysRef.current = next;
        setSavedPlaceKeys(next);
      })
      .catch(() => {})
      .finally(() => { if (isActive) setIsLoading(false); });
    return () => { isActive = false; };
  }, []);

  const toggleSavedPlace = useCallback((city, placeId) => {
    const key = getSavedPlaceKey(city, placeId);
    const next = new Set(savedPlaceKeysRef.current);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    savedPlaceKeysRef.current = next;
    setSavedPlaceKeys(next);

    persistenceQueueRef.current = persistenceQueueRef.current
      .catch(() => {})
      .then(() => AsyncStorage.setItem(SAVED_PLACES_KEY, JSON.stringify([...next])))
      .catch(() => {});
    return persistenceQueueRef.current;
  }, []);

  return { savedPlaceKeys, toggleSavedPlace, isLoading };
}
