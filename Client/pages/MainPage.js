import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  SafeAreaView,
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
import { ErrorState, LoadingState } from './components/StateViews';
import HistoryScreen from './screens/HistoryScreen';
import PlacesScreen from './screens/PlacesScreen';
import WeatherWidget from './Weather';

const Tab = createBottomTabNavigator();
const CityTabsContext = createContext(null);

const TAB_ICONS = {
  History: 'clock',
  Places: 'map',
  Accommodation: 'moon',
  Events: 'calendar',
};

function useCityTabs() {
  const context = useContext(CityTabsContext);
  if (!context) {
    throw new Error('City tabs context is missing');
  }

  return context;
}

const HistoryTabScreen = memo(() => {
  const { data, theme, t } = useCityTabs();

  return <HistoryScreen items={data.history} theme={theme} t={t} />;
});

const PlacesTabScreen = memo(() => {
  const {
    categories,
    data,
    likedPlaces,
    openPlaceDetails,
    placesFilter,
    selectedCity,
    setPlacesFilter,
    theme,
    t,
    toggleLike,
  } = useCityTabs();

  return (
    <PlacesScreen
      places={data.places}
      city={selectedCity}
      categories={categories}
      likedPlaces={likedPlaces}
      onFilterChange={setPlacesFilter}
      onPlacePress={openPlaceDetails}
      onToggleLike={toggleLike}
      selectedFilter={placesFilter}
      theme={theme}
      t={t}
    />
  );
});

const CityTabs = memo(() => {
  const { theme, t } = useCityTabs();

  return (
    <Tab.Navigator
      detachInactiveScreens={false}
      screenOptions={({ route: tabRoute }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.text2,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.text2 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
        unmountOnBlur: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name={TAB_ICONS[tabRoute.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="History" component={HistoryTabScreen} options={{ title: t.history }} />
      <Tab.Screen name="Places" component={PlacesTabScreen} options={{ title: t.places }} />
    </Tab.Navigator>
  );
});

export default function MainPage({ navigation, route }) {
  const { isDarkMode, setIsDarkMode, language, setLanguage, likedPlaces, setLikedPlaces, selectedCity: storedCity, theme } = useContext(AppContext);
  const selectedCity = route.params?.city || storedCity || 'Івано-Франківськ';
  const [placesFilter, setPlacesFilter] = useState('food');
  const { data, categories, isLoading, error, retry } = useCityData(selectedCity, language);
  const t = useMemo(() => ({
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
  }), [language]);

  const toggleLike = useCallback((id) => {
    setLikedPlaces((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, [setLikedPlaces]);

  const openPlaceDetails = useCallback(
    (place) => navigation.navigate('PlaceDetails', { placeId: place.id, city: selectedCity }),
    [navigation, selectedCity]
  );

  const cityTabsValue = useMemo(() => ({
    categories,
    data,
    likedPlaces,
    openPlaceDetails,
    placesFilter,
    selectedCity,
    setPlacesFilter,
    theme,
    t,
    toggleLike,
  }), [
    categories,
    data,
    likedPlaces,
    openPlaceDetails,
    placesFilter,
    selectedCity,
    theme,
    t,
    toggleLike,
  ]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loading, { backgroundColor: theme.bg }]}>
        <LoadingState message="Завантаження даних міста…" theme={theme} />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={[styles.container, styles.loading, { backgroundColor: theme.bg }]}>
        <ErrorState message="Не вдалося завантажити дані міста." onRetry={retry} theme={theme} />
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
          <TouchableOpacity onPress={() => navigation.navigate('CitySelect')} style={styles.changeCityButton} accessibilityRole="button">
            <Text style={[styles.changeCityText, { color: theme.bannerText }]}>{language === 'uk' ? 'Змінити місто' : 'Change city'}</Text>
          </TouchableOpacity>
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

      <CityTabsContext.Provider value={cityTabsValue}>
        <CityTabs />
      </CityTabsContext.Provider>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, margin: 12, elevation: 5 },
  iconButton: { padding: 6, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', letterSpacing: 0.4, marginLeft: 4 },
  controls: { flexDirection: 'row', alignItems: 'center' },
  changeCityButton: { paddingVertical: 6, paddingHorizontal: 8 },
  changeCityText: { fontSize: 13, fontWeight: '700' },
  lang: { fontSize: 14, fontWeight: '700', padding: 8 },
  favoritesRow: { alignItems: 'flex-end', paddingHorizontal: 16, paddingBottom: 4 },
  favoritesButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 14, borderRadius: 12 },
  favoritesText: { fontSize: 15, fontWeight: '700' },
});
