import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, Linking } from 'react-native';
import * as Location from 'expo-location';

const LOCATION_TIMEOUT_MS = 20000;

function getPermissionState(permission) {
  if (permission.granted) return 'granted';
  return permission.status === 'denied' ? 'denied' : 'undetermined';
}

export default function useUserLocation() {
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [locationStatus, setLocationStatus] = useState('idle');
  const [coordinates, setCoordinates] = useState(null);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const coordinatesRef = useRef(null);
  const requestIdRef = useRef(0);

  const getCurrentCoordinates = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setPermissionStatus('granted');
    setLocationStatus('loading');

    let timeoutId;
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) throw new Error('Location services are turned off.');

      const position = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        new Promise((resolve, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Location request timed out.')), LOCATION_TIMEOUT_MS);
        }),
      ]);
      const latitude = position?.coords?.latitude;
      const longitude = position?.coords?.longitude;

      if (
        !Number.isFinite(latitude)
        || !Number.isFinite(longitude)
        || latitude < -90
        || latitude > 90
        || longitude < -180
        || longitude > 180
      ) {
        throw new Error('Location coordinates are unavailable.');
      }

      if (requestId !== requestIdRef.current) return;
      const nextCoordinates = { latitude, longitude };
      coordinatesRef.current = nextCoordinates;
      setCoordinates(nextCoordinates);
      setLocationStatus('available');
    } catch {
      if (requestId !== requestIdRef.current) return;
      coordinatesRef.current = null;
      setCoordinates(null);
      setLocationStatus('unavailable');
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }, []);

  const applyPermission = useCallback(async (permission, forceRefresh = false) => {
    setCanAskAgain(Boolean(permission.canAskAgain));

    if (!permission.granted) {
      requestIdRef.current += 1;
      coordinatesRef.current = null;
      setCoordinates(null);
      setPermissionStatus(getPermissionState(permission));
      setLocationStatus('idle');
      return;
    }

    setPermissionStatus('granted');
    if (forceRefresh || !coordinatesRef.current) {
      await getCurrentCoordinates();
    } else {
      setLocationStatus('available');
    }
  }, [getCurrentCoordinates]);

  const refreshLocation = useCallback(async (forceRefresh = false) => {
    try {
      const permission = await Location.getForegroundPermissionsAsync();
      await applyPermission(permission, forceRefresh);
    } catch {
      requestIdRef.current += 1;
      coordinatesRef.current = null;
      setCoordinates(null);
      setCanAskAgain(false);
      setPermissionStatus('unavailable');
      setLocationStatus('unavailable');
    }
  }, [applyPermission]);

  const requestPermission = useCallback(async () => {
    setPermissionStatus('unknown');
    setLocationStatus('loading');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      await applyPermission(permission, true);
    } catch {
      requestIdRef.current += 1;
      coordinatesRef.current = null;
      setCoordinates(null);
      setCanAskAgain(false);
      setPermissionStatus('unavailable');
      setLocationStatus('unavailable');
    }
  }, [applyPermission]);

  const requestLocation = useCallback(async () => {
    let permission;
    try {
      permission = await Location.getForegroundPermissionsAsync();
    } catch {
      setCanAskAgain(false);
      setPermissionStatus('unavailable');
      setLocationStatus('unavailable');
      return;
    }

    if (permission.granted) {
      await applyPermission(permission, true);
      return;
    }

    await applyPermission(permission);
    if (!permission.canAskAgain) return;

    Alert.alert(
      'Навіщо потрібна геолокація?',
      'Місцезнаходження допоможе визначати відстань до місць поруч. Координати залишаються на пристрої й не надсилаються команді.',
      [
        { text: 'Не зараз', style: 'cancel' },
        { text: 'Продовжити', onPress: () => { requestPermission(); } },
      ]
    );
  }, [applyPermission, requestPermission]);

  const openLocationSettings = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch {
      setPermissionStatus('unavailable');
      setLocationStatus('unavailable');
    }
  }, []);

  useEffect(() => {
    refreshLocation();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshLocation();
    });

    return () => subscription.remove();
  }, [refreshLocation]);

  return {
    permissionStatus,
    locationStatus,
    coordinates,
    canAskAgain,
    requestLocation,
    openLocationSettings,
    refreshLocation,
  };
}
