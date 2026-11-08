import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAY_PLAN_KEY = '@ITStepUserApp:dayPlan:v1';
const DEFAULT_VISIT_MINUTES = 60;
const MIN_VISIT_MINUTES = 5;
const MAX_VISIT_MINUTES = 480;

export const getDayPlanStopKey = (city, placeId) =>
  JSON.stringify([String(city), String(placeId)]);

const getCoordinates = (place) => {
  const coordinates = place?.coordinates;
  const latitude = coordinates?.latitude ?? place?.latitude;
  const longitude = coordinates?.longitude ?? place?.longitude;

  if (
    !Number.isFinite(latitude)
    || !Number.isFinite(longitude)
    || latitude < -90
    || latitude > 90
    || longitude < -180
    || longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
};

const normalizeStop = (stop) => {
  if (
    !stop
    || typeof stop.city !== 'string'
    || stop.city.length === 0
    || stop.placeId === undefined
    || stop.placeId === null
  ) {
    return null;
  }

  const visitMinutes = Number.parseInt(stop.visitMinutes, 10);
  return {
    city: stop.city,
    placeId: String(stop.placeId),
    name: typeof stop.name === 'string' && stop.name.trim() ? stop.name : 'Місце без назви',
    address: typeof stop.address === 'string' ? stop.address : '',
    photo: typeof stop.photo === 'string' ? stop.photo : null,
    coordinates: getCoordinates(stop),
    visitMinutes: Number.isFinite(visitMinutes)
      ? Math.min(MAX_VISIT_MINUTES, Math.max(MIN_VISIT_MINUTES, visitMinutes))
      : DEFAULT_VISIT_MINUTES,
  };
};

export default function useDayPlan() {
  const [stops, setStops] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const stopsRef = useRef([]);
  const writeQueueRef = useRef(Promise.resolve());

  useEffect(() => {
    let isActive = true;

    AsyncStorage.getItem(DAY_PLAN_KEY)
      .then((storedValue) => {
        let parsedStops = [];
        try {
          const parsedValue = storedValue ? JSON.parse(storedValue) : [];
          if (Array.isArray(parsedValue)) {
            parsedStops = parsedValue.map(normalizeStop).filter(Boolean);
          }
        } catch {
          parsedStops = [];
        }

        const uniqueStops = parsedStops.filter((stop, index, list) => (
          list.findIndex((candidate) => (
            getDayPlanStopKey(candidate.city, candidate.placeId)
            === getDayPlanStopKey(stop.city, stop.placeId)
          )) === index
        ));

        if (!isActive) return;
        stopsRef.current = uniqueStops;
        setStops(uniqueStops);
      })
      .catch((error) => {
        console.error('Не вдалося завантажити план дня:', error);
      })
      .finally(() => {
        if (isActive) setIsReady(true);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    stopsRef.current = stops;
    if (!isReady) return;

    writeQueueRef.current = writeQueueRef.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(DAY_PLAN_KEY, JSON.stringify(stops)))
      .catch((error) => {
        console.error('Не вдалося зберегти план дня:', error);
      });
  }, [isReady, stops]);

  const addStop = useCallback((city, place) => {
    if (!city || !place || place.id === undefined || place.id === null) return;
    const key = getDayPlanStopKey(city, place.id);
    if (stopsRef.current.some((stop) => getDayPlanStopKey(stop.city, stop.placeId) === key)) return;

    const nextStops = [
      ...stopsRef.current,
      normalizeStop({
        city,
        placeId: place.id,
        name: place.name || place.title,
        address: place.address,
        photo: place.photos?.[0] || place.image,
        coordinates: getCoordinates(place),
        visitMinutes: DEFAULT_VISIT_MINUTES,
      }),
    ].filter(Boolean);

    stopsRef.current = nextStops;
    setStops(nextStops);
  }, []);

  const removeStop = useCallback((city, placeId) => {
    const key = getDayPlanStopKey(city, placeId);
    const nextStops = stopsRef.current.filter(
      (stop) => getDayPlanStopKey(stop.city, stop.placeId) !== key
    );
    stopsRef.current = nextStops;
    setStops(nextStops);
  }, []);

  const moveStop = useCallback((city, placeId, direction) => {
    if (direction !== -1 && direction !== 1) return;
    const key = getDayPlanStopKey(city, placeId);
    const currentIndex = stopsRef.current.findIndex(
      (stop) => getDayPlanStopKey(stop.city, stop.placeId) === key
    );
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= stopsRef.current.length) return;

    const nextStops = [...stopsRef.current];
    [nextStops[currentIndex], nextStops[nextIndex]] = [nextStops[nextIndex], nextStops[currentIndex]];
    stopsRef.current = nextStops;
    setStops(nextStops);
  }, []);

  const updateVisitMinutes = useCallback((city, placeId, value) => {
    const visitMinutes = Number.parseInt(value, 10);
    if (!Number.isFinite(visitMinutes)) return;

    const key = getDayPlanStopKey(city, placeId);
    const nextStops = stopsRef.current.map((stop) => (
      getDayPlanStopKey(stop.city, stop.placeId) === key
        ? {
          ...stop,
          visitMinutes: Math.min(MAX_VISIT_MINUTES, Math.max(MIN_VISIT_MINUTES, visitMinutes)),
        }
        : stop
    ));

    stopsRef.current = nextStops;
    setStops(nextStops);
  }, []);

  return { stops, isReady, addStop, removeStop, moveStop, updateVisitMinutes };
}
