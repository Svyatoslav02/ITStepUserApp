import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

const WeatherWidget = ({ theme, t, selectedCity }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = 'c6435433aac50404804bb9341b3c3f5c';

  const fetchWeather = async () => {
    try {
      const city = (selectedCity || 'Lviv').trim().replace(/\s+/g, '+');
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city},UA&appid=${API_KEY}&units=metric&lang=uk`;

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Не вдалося отримати дані про погоду');
      }

      setWeatherData({
        temp: `${Math.round(data.main.temp)}°C`,
        humidity: `${data.main.humidity}%`,
        wind: `${Math.round(data.wind.speed * 3.6)} км/год`, // з м/с у км/год
        icon: getWeatherIcon(data.weather[0].icon),
        description: data.weather[0].description,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    }
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': 'sun', '01n': 'moon',
      '02d': 'cloud', '02n': 'cloud',
      '03d': 'cloud', '03n': 'cloud',
      '04d': 'cloud', '04n': 'cloud',
      '09d': 'cloud-drizzle', '09n': 'cloud-drizzle',
      '10d': 'cloud-rain', '10n': 'cloud-rain',
      '11d': 'cloud-lightning', '11n': 'cloud-lightning',
      '13d': 'cloud-snow', '13n': 'cloud-snow',
      '50d': 'cloud', '50n': 'cloud',
    };
    return iconMap[iconCode] || 'cloud';
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000); // кожні 30 хв
    return () => clearInterval(interval);
  }, [selectedCity]);

  if (error || !weatherData) {
    return (
      <View style={[s.weatherContainer, { backgroundColor: theme.card }]}>
        <Text style={[s.weatherTitle, { color: theme.text }]}>
          {t.weather} {t.unavailable}
        </Text>
        {error && (
          <Text style={[s.errorText, { color: theme.text2 }]}>
            ⚠ {error}
          </Text>
        )}
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
        ].map(({ label, value }, i) => (
          <View key={i} style={s.weatherRow}>
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
  weatherDetails: { borderTopWidth: 1, borderTopColor: '#333', paddingTop: 14 },
  weatherRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  weatherLabel: { fontSize: 16, fontWeight: '600' },
  weatherValue: { fontSize: 16, fontWeight: '700' },
  errorText: { fontSize: 16, fontWeight: '500', marginTop: 8 },
});

export default WeatherWidget;