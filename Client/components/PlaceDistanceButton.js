import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { calculateDistanceMeters, formatDistance } from '../utils/distance';

function readCoordinates(place) {
  const latitude = place?.latitude ?? place?.coordinates?.latitude;
  const longitude = place?.longitude ?? place?.coordinates?.longitude;
  if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) return null;
  const coordinates = { latitude: Number(latitude), longitude: Number(longitude) };
  return Number.isFinite(coordinates.latitude) && Number.isFinite(coordinates.longitude) ? coordinates : null;
}

export default function PlaceDistanceButton({ place, city, language, style, textStyle }) {
  const [distance, setDistance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const isUkrainian = language !== 'en';

  const calculateForPlace = async () => {
    setIsLoading(true);
    setIsUnavailable(false);
    try {
      const permission = await Location.getForegroundPermissionsAsync();
      const permissionResult = permission.granted ? permission : await Location.requestForegroundPermissionsAsync();
      if (!permissionResult.granted) {
        setDistance(null);
        setIsUnavailable(true);
        return;
      }

      const [currentPosition, destination] = await Promise.all([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        (async () => {
          const coordinates = readCoordinates(place);
          if (coordinates) return coordinates;
          const query = [place?.address, place?.name, city].filter(Boolean).join(', ');
          const [result] = await Location.geocodeAsync(query);
          return result ? { latitude: result.latitude, longitude: result.longitude } : null;
        })(),
      ]);

      if (!destination) {
        setDistance(null);
        setIsUnavailable(true);
        return;
      }
      const meters = calculateDistanceMeters(currentPosition.coords, destination);
      const formattedDistance = formatDistance(meters);
      setDistance(formattedDistance);
      setIsUnavailable(!formattedDistance);
    } catch {
      setDistance(null);
      setIsUnavailable(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onPress = async () => {
    if (isLoading) return;
    try {
      const permission = await Location.getForegroundPermissionsAsync();
      if (permission.granted) {
        await calculateForPlace();
        return;
      }
    } catch {
      setIsUnavailable(true);
      return;
    }

    Alert.alert(
      isUkrainian ? 'Потрібен доступ до геолокації' : 'Location access needed',
      isUkrainian
        ? 'Поточне місце потрібне лише для розрахунку відстані до цього місця.'
        : 'Your current location is used only to calculate the distance to this place.',
      [
        { text: isUkrainian ? 'Скасувати' : 'Cancel', style: 'cancel' },
        { text: isUkrainian ? 'Продовжити' : 'Continue', onPress: calculateForPlace },
      ]
    );
  };

  const label = isLoading
    ? (isUkrainian ? 'Рахую…' : 'Calculating…')
    : distance || (isUnavailable
      ? (isUkrainian ? 'Недоступно' : 'Unavailable')
      : (isUkrainian ? 'Порахувати' : 'Calculate'));

  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={distance
        ? `${isUkrainian ? 'Відстань до' : 'Distance to'} ${place?.name || ''}: ${distance}`
        : `${isUkrainian ? 'Обчислити відстань до' : 'Calculate distance to'} ${place?.name || ''}`}
    >
      {isLoading ? <ActivityIndicator size="small" color="#fbbf24" /> : <Icon name="navigation" size={16} color="#fbbf24" />}
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}
