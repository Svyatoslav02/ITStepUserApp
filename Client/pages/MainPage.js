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
import AccommodationScreen from './screens/AccommodationScreen';
import HistoryScreen from './screens/HistoryScreen';
import PlacesScreen from './screens/PlacesScreen';
import ProfileScreen from './screens/ProfileScreen';
import WeatherWidget from './Weather';

const Tab = createBottomTabNavigator();
const CityTabsContext = createContext(null);

const TAB_ICONS = {
  Places: 'map',
  Accommodation: 'moon',
  Profile: 'user',
  History: 'clock',
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
      header={<WeatherWidget coordinates={data.coordinates} theme={theme} t={t} />}
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

const AccommodationTabScreen = memo(() => {
  const {
    accommodationFilter,
    data,
    likedPlaces,
    openPlaceDetails,
    selectedCity,
    setAccommodationFilter,
    theme,
    t,
    toggleLike,
  } = useCityTabs();

  return (
    <AccommodationScreen
      accommodation={data.accommodation}
      city={selectedCity}
      likedPlaces={likedPlaces}
      onAccommodationPress={openPlaceDetails}
      onFilterChange={setAccommodationFilter}
      onToggleLike={toggleLike}
      selectedFilter={accommodationFilter}
      theme={theme}
      t={t}
    />
  );
});

const ProfileTabScreen = memo(() => {
  const {
    likedPlaces,
    openSaved,
    theme,
  } = useCityTabs();

  return (
    <ProfileScreen
      likedCount={likedPlaces.size}
      onOpenSaved={openSaved}
      theme={theme}
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
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: theme.card, borderTopWidth: 0, height: 58, paddingVertical: 0 },
        tabBarItemStyle: { alignItems: 'center', justifyContent: 'center', padding: 0 },
        tabBarIconStyle: { margin: 0 },
        sceneStyle: { backgroundColor: theme.bg },
        unmountOnBlur: false,
        tabBarIcon: ({ color, size }) => (
          <Icon name={TAB_ICONS[tabRoute.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Places" component={PlacesTabScreen} options={{ title: t.places }} />
      <Tab.Screen name="Accommodation" component={AccommodationTabScreen} options={{ title: t.accommodation }} />
      <Tab.Screen name="Profile" component={ProfileTabScreen} options={{ title: t.profile }} />
      <Tab.Screen name="History" component={HistoryTabScreen} options={{ title: t.history }} />
    </Tab.Navigator>
  );
});

export default function MainPage({ navigation, route }) {
  const { isDarkMode, setIsDarkMode, likedPlaces, setLikedPlaces, selectedCity: storedCity, theme } = useContext(AppContext);
  const selectedCity = route.params?.city || storedCity || 'Івано-Франківськ';
  const [placesFilter, setPlacesFilter] = useState('food');
  const [accommodationFilter, setAccommodationFilter] = useState('hotel');
  const { data, categories, isLoading, error } = useCityData(selectedCity, 'uk');
  const t = useMemo(() => ({
    history: 'Історія',
    places: 'Місця',
    accommodation: 'Ночівля',
    profile: 'Профіль',
    weather: 'Погода',
    currentWeather: 'Поточна погода',
    temperature: 'Температура',
    humidity: 'Вологість',
    wind: 'Вітер',
    food: 'Їжа',
    culture: 'Культура',
    nature: 'Природа',
    shopping: 'Шопінг',
    entertainment: 'Розваги',
    unavailable: 'недоступна',
    placesUnavailable: 'Місця недоступні',
    rating: 'Рейтинг',
    address: 'Адреса',
    description: 'Опис',
  }), []);

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

  const openSaved = useCallback(() => navigation.navigate('Saved', { city: selectedCity }), [navigation, selectedCity]);

  const cityTabsValue = useMemo(() => ({
    accommodationFilter,
    categories,
    data,
    likedPlaces,
    openPlaceDetails,
    openSaved,
    placesFilter,
    selectedCity,
    setAccommodationFilter,
    setPlacesFilter,
    theme,
    t,
    toggleLike,
  }), [
    accommodationFilter,
    categories,
    data,
    likedPlaces,
    openPlaceDetails,
    openSaved,
    placesFilter,
    selectedCity,
    theme,
    t,
    toggleLike,
  ]);

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
        <Text numberOfLines={1} style={[styles.headerTitle, { color: theme.bannerText }]}>{selectedCity}</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => navigation.navigate('CitySelect')} style={styles.changeCityButton} accessibilityRole="button">
            <Text style={[styles.changeCityText, { color: theme.bannerText }]}>Змінити місто</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.iconButton}>
            <Icon name={isDarkMode ? 'sun' : 'moon'} size={24} color={theme.bannerText} />
          </TouchableOpacity>
        </View>
      </View>

      <CityTabsContext.Provider value={cityTabsValue}>
        <CityTabs />
      </CityTabsContext.Provider>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0 },
  loading: { alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, margin: 12, elevation: 5 },
  iconButton: { padding: 6, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', letterSpacing: 0.4, marginLeft: 4 },
  controls: { flexDirection: 'row', alignItems: 'center' },
  changeCityButton: { paddingVertical: 6, paddingHorizontal: 8 },
  changeCityText: { fontSize: 13, fontWeight: '700' },
});
