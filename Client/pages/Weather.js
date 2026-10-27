import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const UPDATE_INTERVAL_MS = 30 * 60 * 1000;

const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'cloud',
    '02n': 'cloud',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-drizzle',
    '09n': 'cloud-drizzle',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'cloud',
    '50n': 'cloud',
  };
  return iconMap[iconCode] || 'cloud';
};

const isValidCoordinate = (value) => Number.isFinite(Number(value));

const buildWeatherUrl = ({ latitude, longitude }) => {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    appid: API_KEY,
    units: 'metric',
    lang: 'uk',
  });

  return `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`;
};

const toWeatherViewModel = (data) => {
  const temperature = data?.main?.temp;
  const humidity = data?.main?.humidity;
  const windSpeed = data?.wind?.speed;
  const weather = data?.weather?.[0];

  if (!Number.isFinite(temperature) || !Number.isFinite(humidity) || !Number.isFinite(windSpeed) || !weather) {
    throw new Error('Отримано неповні дані про погоду');
  }

  return {
    temp: `${Math.round(temperature)}°C`,
    humidity: `${humidity}%`,
    wind: `${Math.round(windSpeed * 3.6)} км/год`,
    icon: getWeatherIcon(weather.icon),
    description: weather.description,
  };
};

const WeatherWidget = ({ theme, t, coordinates }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (signal) => {
    if (!API_KEY) {
      setWeatherData(null);
      setError('Додайте EXPO_PUBLIC_OPENWEATHER_API_KEY у Client/.env');
      return;
    }

    const hasCoordinates = coordinates && isValidCoordinate(coordinates.latitude) && isValidCoordinate(coordinates.longitude);
    if (!hasCoordinates) {
      setWeatherData(null);
      setError('Для цього міста не вказані координати');
      return;
    }

    try {
      const response = await fetch(buildWeatherUrl(coordinates), { signal });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Не вдалося отримати дані про погоду');
      }

      setWeatherData(toWeatherViewModel(data));
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setWeatherData(null);
      setError(err.message || 'Не вдалося отримати дані про погоду');
    }
  }, [coordinates]);

  useEffect(() => {
    const controller = new AbortController();
    fetchWeather(controller.signal);

    const intervalId = setInterval(() => {
      fetchWeather(controller.signal);
    }, UPDATE_INTERVAL_MS);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, [fetchWeather]);

  if (error || !weatherData) {
    return (
      <View style={[s.weatherContainer, { backgroundColor: theme.card }]}>
        <Text style={[s.weatherTitle, s.errorTitle, { color: theme.text }]}>
          {t.weather} {t.unavailable}
        </Text>
        {error ? (
          <Text style={[s.errorText, { color: theme.text2 }]}>
            {error}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[s.weatherContainer, { backgroundColor: theme.card }]}>
      <View style={s.weatherHeader}>
        <Icon name={weatherData.icon} size={28} color={theme.accent} />
        <Text style={[s.weatherTitle, { color: theme.text }]}>
          {t.currentWeather}
        </Text>
      </View>
      <View style={s.weatherDetails}>
        {[
          { label: t.temperature, value: weatherData.temp },
          { label: t.humidity, value: weatherData.humidity },
          { label: t.wind, value: weatherData.wind },
        ].map(({ label, value }) => (
          <View key={label} style={s.weatherRow}>
            <Text style={[s.weatherLabel, { color: theme.text2 }]}>{label}:</Text>
            <Text style={[s.weatherValue, { color: theme.text }]}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  weatherContainer: {
    paddingVertical: 24,
    paddingHorizontal: 28,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  weatherHeader: { flexDirection: 'row', marginBottom: 18 },
  weatherTitle: { fontSize: 22, fontWeight: '700', marginLeft: 10, lineHeight: 32 },
  errorTitle: { marginLeft: 0 },
  weatherDetails: { borderTopWidth: 1, borderTopColor: '#333', paddingTop: 14 },
  weatherRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  weatherLabel: { fontSize: 16, fontWeight: '600' },
  weatherValue: { fontSize: 16, fontWeight: '700' },
  errorText: { fontSize: 16, fontWeight: '500', marginTop: 8 },
});

export default WeatherWidget;
