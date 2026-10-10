import React, { useContext, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather as Icon } from '@expo/vector-icons';
import AppContext from '../AppContext';
import useCityData from '../services/useCityData';
import PlacesWidget from './Places';
import WeatherWidget from './Weather';

const Tab = createBottomTabNavigator();

function HistoryScreen({ items, theme, title }) {
  if (!items || items.length === 0) {
    return <Text style={[styles.empty, { color: theme.text2 }]}>{title} недоступна</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.historyList} showsVerticalScrollIndicator={false}>
      {items.map((item, index) => (
        <View key={`${item.title}-${index}`} style={[styles.historyCard, { backgroundColor: theme.card }]}>
          {item.image ? <Image source={{ uri: item.image }} style={styles.historyImage} /> : null}
          <Text style={[styles.historyTitle, { color: theme.text }]}>{item.title}</Text>
          {item.text.split('\n').map((paragraph, paragraphIndex) => (
            <Text key={paragraphIndex} style={[styles.historyText, { color: theme.text2 }]}>{paragraph.trim()}</Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

export default function MainPage({ navigation, route }) {
  const { isDarkMode, setIsDarkMode, language, setLanguage, likedPlaces, setLikedPlaces, theme } = useContext(AppContext);
  const selectedCity = route.params?.city || 'Івано-Франківськ';
  const [placesFilter, setPlacesFilter] = useState('food');
  const { data, categories, isLoading, error } = useCityData(selectedCity, language);
  const t = {
    history: language === 'uk' ? 'Історія' : 'History',
    places: language === 'uk' ? 'Місця' : 'Places',
    favoritesButton: language === 'uk' ? 'Обрані місця' : 'Saved places',
    weather: language === 'uk' ? 'Погода' : 'Weather',
    currentWeather: language === 'uk' ? 'Поточна погода' : 'Current weather',
    temperature: language === 'uk' ? 'Температура' : 'Temperature',
    humidity: language === 'uk' ? 'Вологість' : 'Humidity',
    wind: language === 'uk' ? 'Вітер' : 'Wind',
    food: language === 'uk' ? 'Їжа' : 'Food',
    culture: language === 'uk' ? 'Культура' : 'Culture',
    nature: language === 'uk' ? 'Природа' : 'Nature',
    shopping: language === 'uk' ? 'Шопінг' : 'Shopping',
    entertainment: language === 'uk' ? 'Розваги' : 'Entertainment',
    unavailable: language === 'uk' ? 'недоступна' : 'unavailable',
    placesUnavailable: language === 'uk' ? 'Місця недоступні' : 'Places unavailable',
    rating: language === 'uk' ? 'Рейтинг' : 'Rating',
    address: language === 'uk' ? 'Адреса' : 'Address',
    description: language === 'uk' ? 'Опис' : 'Description',
  };

  const toggleLike = (id) => {
    setLikedPlaces((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const openPlaceDetails = (place) => navigation.navigate('PlaceDetails', { placeId: place.id, city: selectedCity });

  if (isLoading || !data) {
    return (
      <SafeAreaView style={[styles.container, styles.loading, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.text2 }}>{error ? 'Не вдалося завантажити дані міста.' : 'Завантаження даних міста…'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: theme.banner }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton} accessibilityLabel="Назад">
          <Icon name="chevron-left" size={24} color={theme.bannerText} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={[styles.headerTitle, { color: theme.bannerText }]}>{selectedCity}</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setLanguage(language === 'uk' ? 'en' : 'uk')}>
            <Text style={[styles.lang, { color: theme.bannerText }]}>{language === 'uk' ? 'EN' : 'UKR'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.iconButton}>
            <Icon name={isDarkMode ? 'sun' : 'moon'} size={24} color={theme.bannerText} />
          </TouchableOpacity>
        </View>
      </View>

      <WeatherWidget data={data} theme={theme} t={t} selectedCity={selectedCity} />

      <View style={styles.favoritesRow}>
        <TouchableOpacity
          style={[styles.favoritesButton, { backgroundColor: theme.favBtnBg }]}
          onPress={() => navigation.navigate('Saved', { city: selectedCity })}
          activeOpacity={0.8}
        >
          <Icon name="heart" size={20} color={theme.favBtnText} style={{ marginRight: 6 }} />
          <Text style={[styles.favoritesText, { color: theme.favBtnText }]}>{t.favoritesButton}</Text>
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        screenOptions={({ route: tabRoute }) => ({
          headerShown: false,
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.text2,
          tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.text2 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
          tabBarIcon: ({ color, size }) => {
            const icons = { History: 'clock', Places: 'map' };
            return <Icon name={icons[tabRoute.name]} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="History" options={{ title: t.history }}>
          {() => <HistoryScreen items={data.history} theme={theme} title={t.history} />}
        </Tab.Screen>
        <Tab.Screen name="Places" options={{ title: t.places }}>
          {() => (
            <PlacesWidget
              data={data}
              theme={theme}
              t={t}
              likedPlaces={likedPlaces}
              toggleLike={toggleLike}
              placesFilter={placesFilter}
              setPlacesFilter={setPlacesFilter}
              onPlacePress={openPlaceDetails}
              categories={categories}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, margin: 12, elevation: 5 },
  iconButton: { padding: 6, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', letterSpacing: 0.4, marginLeft: 4 },
  controls: { flexDirection: 'row', alignItems: 'center' },
  lang: { fontSize: 14, fontWeight: '700', padding: 8 },
  favoritesRow: { alignItems: 'flex-end', paddingHorizontal: 16, paddingBottom: 4 },
  favoritesButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 12 },
  favoritesText: { fontSize: 15, fontWeight: '700' },
  empty: { padding: 24, textAlign: 'center' },
  historyList: { paddingHorizontal: 18, paddingBottom: 24 },
  historyCard: { padding: 20, borderRadius: 14, marginVertical: 10, elevation: 5 },
  historyImage: { width: '100%', height: 220, borderRadius: 14, marginBottom: 14 },
  historyTitle: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
  historyText: { fontSize: 16, fontWeight: '500', lineHeight: 24, marginBottom: 10 },
});
