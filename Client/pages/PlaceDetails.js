import React, { useContext } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import AppContext from '../AppContext';
import usePlace from '../services/usePlace';

const getDisplayLines = (value) => {
  if (typeof value === 'string') return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap(getDisplayLines);
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .filter(([, item]) => item !== null && item !== undefined && String(item).trim())
      .map(([label, item]) => `${label}: ${item}`);
  }
  return [];
};

export default function PlaceDetails({ navigation, route }) {
  const { isDarkMode, language, theme, selectedCity } = useContext(AppContext);
  const { placeId } = route.params;
  const city = selectedCity || route.params.city;
  const { place, isLoading, error } = usePlace(city, placeId, language);

  if (isLoading || !place) {
    return (
      <SafeAreaView style={[styles.container, styles.loading, { backgroundColor: theme.bg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Назад">
          <Icon name="chevron-left" size={24} color={theme.bannerText} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CitySelect')} style={styles.changeCityButton} accessibilityRole="button">
          <Text style={[styles.changeCityText, { color: theme.bannerText }]}>{language === 'uk' ? 'Змінити місто' : 'Change city'}</Text>
        </TouchableOpacity>
        <Text style={[styles.body, { color: theme.text2 }]}>
          {isLoading ? 'Завантаження місця…' : error ? 'Не вдалося завантажити місце.' : 'Місце не знайдено.'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: theme.banner }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Назад">
          <Icon name="chevron-left" size={24} color={theme.bannerText} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={[styles.headerTitle, { color: theme.bannerText }]}>{place.name || 'Місце без назви'}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CitySelect')} style={styles.changeCityButton} accessibilityRole="button">
          <Text style={[styles.changeCityText, { color: theme.bannerText }]}>{language === 'uk' ? 'Змінити місто' : 'Change city'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {(place.photos || []).filter(Boolean).map((photo, index) => (
          <Image key={`${place.id}-photo-${index}`} source={{ uri: photo }} style={styles.image} />
        ))}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>{place.name || 'Місце без назви'}</Text>
          {place.description ? <Text style={[styles.body, { color: theme.text2 }]}>{place.description}</Text> : null}
          {place.address ? (
            <View style={styles.detailRow}>
              <Icon name="map-pin" size={20} color={theme.accent} />
              <Text style={[styles.body, styles.detailText, { color: theme.text2 }]}>{place.address}</Text>
            </View>
          ) : null}
          {Number.isFinite(place.rating) ? (
            <View style={styles.detailRow}>
              <Icon name="star" size={20} color="#fbbf24" />
              <Text style={[styles.body, styles.detailText, { color: theme.text2 }]}>{place.rating.toFixed(1)}</Text>
              {Number.isFinite(place.reviewCount) ? (
                <Text style={[styles.body, styles.detailText, { color: theme.text2 }]}>{place.reviewCount} відгуків</Text>
              ) : null}
            </View>
          ) : null}
          {place.category ? <Text style={[styles.category, { color: theme.accent }]}>{place.category}</Text> : null}
          {getDisplayLines(place.coordinates).map((line) => (
            <Text key={`coordinate-${line}`} style={[styles.body, styles.optionalDetail, { color: theme.text2 }]}>{line}</Text>
          ))}
          {getDisplayLines(place.contacts).map((line) => (
            <Text key={`contact-${line}`} style={[styles.body, styles.optionalDetail, { color: theme.text2 }]}>{line}</Text>
          ))}
          {getDisplayLines(place.workingHours).map((line) => (
            <Text key={`hours-${line}`} style={[styles.body, styles.optionalDetail, { color: theme.text2 }]}>{line}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, margin: 12, borderRadius: 12, elevation: 5 },
  backButton: { padding: 6 },
  changeCityButton: { paddingHorizontal: 6, paddingVertical: 8 },
  changeCityText: { fontSize: 11, fontWeight: '700' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', marginLeft: 4 },
  content: { paddingBottom: 32 },
  image: { width: '100%', height: 260, resizeMode: 'cover' },
  card: { padding: 20, margin: 16, borderRadius: 14, elevation: 4 },
  title: { fontSize: 23, fontWeight: '800', marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 24 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  optionalDetail: { marginTop: 12 },
  detailText: { flex: 1, marginLeft: 10 },
  category: { marginTop: 18, fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
});
