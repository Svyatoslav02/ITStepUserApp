import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import cityData from './Data';
import Saved from './Saved';
import MainTabs from './components/MainTabs';
import HistoryScreen from './screens/HistoryScreen';
import PlacesScreen from './screens/PlacesScreen';
import AccommodationScreen from './screens/AccommodationScreen';
import EventsScreen from './screens/EventsScreen';
import Donate from './Donate';
import WeatherWidget from './Weather';

const DARK_THEME = {
  bg: '#121212',
  card: '#1f1f1f',
  text: '#e5e5e5',
  text2: '#aaaaaa',
  accent: '#FFD700',
  banner: '#1f1f1f',
  bannerText: '#FFD700',
  inactiveHeart: '#1f1f1f',
  favBtnBg: '#FFD700',
  favBtnText: '#000000',
};

const LIGHT_THEME = {
  bg: '#f0f4f8',
  card: '#ffffff',
  text: '#1f2937',
  text2: '#4b5563',
  accent: 'rgb(67, 80, 105)',
  banner: '#1f2937',
  bannerText: '#ffffff',
  inactiveHeart: '#1f2937',
  favBtnBg: '#1f2937',
  favBtnText: '#ffffff',
};

const TabScene = ({ isActive, children }) => (
  <View
    style={[s.scene, !isActive && s.hiddenScene]}
    pointerEvents={isActive ? 'auto' : 'none'}
  >
    {children}
  </View>
);

const MainPage = ({ selectedCity, onBackPress, language, isDarkMode, setLanguage, setIsDarkMode }) => {
  const [activeTab, setActiveTab] = useState('history');
  const [placesFilter, setPlacesFilter] = useState('food');
  const [accommodationFilter, setAccommodationFilter] = useState('hotel');
  const [eventsFilter, setEventsFilter] = useState('concert');
  const [likedPlaces, setLikedPlaces] = useState(new Set());
  const [showFavorites, setShowFavorites] = useState(false);
  const [isDonateVisible, setIsDonateVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]);

  const t = useMemo(() => ({
    history: 'Історія',
    places: 'Місця',
    accommodation: 'Ночівля',
    events: 'Події',
    close: 'Закрити',
    favoritesButton: 'Обрані місця',
    weather: 'Погода',
    currentWeather: 'Поточна погода',
    temperature: 'Температура',
    humidity: 'Вологість',
    wind: 'Вітер',
    share: 'Підтримати',
    shareMessage: `Подивись цей чудовий додаток про ${selectedCity}!`,
    food: 'Їжа',
    culture: 'Культура',
    nature: 'Природа',
    shopping: 'Шопінг',
    entertainment: 'Розваги',
    concert: 'Концерти',
    unavailable: 'недоступна',
    placesUnavailable: 'Місця недоступні',
    rating: 'Рейтинг',
    address: 'Адреса',
    description: 'Опис',
  }), [selectedCity]);

  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  const data = useMemo(() => ({
    weather: cityData[selectedCity]?.weather.uk,
    places: cityData[selectedCity]?.places.uk,
    history: cityData[selectedCity]?.history.uk,
    accommodation: cityData[selectedCity]?.accommodation.uk,
    events: cityData[selectedCity]?.events.uk,
  }), [selectedCity]);

  const handleSupport = useCallback(() => {
    setIsDonateVisible(true);
  }, []);

  const handleCloseDonate = useCallback(() => {
    setIsDonateVisible(false);
  }, []);

  const handleTabPress = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const toggleLike = useCallback((id) => {
    setLikedPlaces((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }, []);

  if (showFavorites) {
    return (
      <Saved
        likedPlaces={likedPlaces}
        placesData={data.places}
        language={language}
        isDarkMode={isDarkMode}
        toggleLike={toggleLike}
        onBackPress={() => setShowFavorites(false)}
      />
    );
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[s.header, { backgroundColor: theme.banner }]}>
        <TouchableOpacity onPress={onBackPress} style={s.iconBtn}>
          <Icon name="chevron-left" size={24} color={theme.bannerText} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={[s.headerTitle, { color: theme.bannerText }]}>
          {selectedCity}
        </Text>
        <View style={s.controls}>
          <TouchableOpacity onPress={() => setLanguage(language === 'uk' ? 'en' : 'uk')}>
            <Text style={[s.lang, { color: theme.bannerText }]}>
              {language === 'uk' ? 'EN' : 'UKR'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSupport}>
            <Icon name="gift" size={24} color={theme.bannerText} style={{ marginRight: 12 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={s.iconBtn}>
            <Icon name={isDarkMode ? 'sun' : 'moon'} size={24} color={theme.bannerText} />
          </TouchableOpacity>
        </View>
      </View>

      <WeatherWidget data={data} theme={theme} t={t} selectedCity={selectedCity} />

      <View style={s.favBtnContainer}>
        <TouchableOpacity
          style={[s.favBtn, { backgroundColor: theme.favBtnBg }]}
          onPress={() => setShowFavorites(true)}
          activeOpacity={0.8}
        >
          <Icon name="heart" size={20} color={theme.favBtnText} style={{ marginRight: 6 }} />
          <Text style={[s.favBtnText, { color: theme.favBtnText }]}>{t.favoritesButton}</Text>
        </TouchableOpacity>
      </View>

      <MainTabs
        activeTab={activeTab}
        onTabPress={handleTabPress}
        t={t}
        theme={theme}
        isDarkMode={isDarkMode}
      />

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <TabScene isActive={activeTab === 'history'}>
          <HistoryScreen items={data.history} theme={theme} t={t} />
        </TabScene>
        <TabScene isActive={activeTab === 'places'}>
          <PlacesScreen
            places={data.places}
            theme={theme}
            t={t}
            likedPlaces={likedPlaces}
            onToggleLike={toggleLike}
            selectedFilter={placesFilter}
            onFilterChange={setPlacesFilter}
          />
        </TabScene>
        <TabScene isActive={activeTab === 'accommodation'}>
          <AccommodationScreen
            accommodation={data.accommodation}
            theme={theme}
            t={t}
            selectedFilter={accommodationFilter}
            onFilterChange={setAccommodationFilter}
          />
        </TabScene>
        <TabScene isActive={activeTab === 'events'}>
          <EventsScreen
            events={data.events}
            theme={theme}
            t={t}
            selectedFilter={eventsFilter}
            onFilterChange={setEventsFilter}
          />
        </TabScene>
      </Animated.View>

      <Donate
        isVisible={isDonateVisible}
        onClose={handleCloseDonate}
        theme={theme}
        language={language}
      />
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  scene: { flex: 1 },
  hiddenScene: { display: 'none' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    margin: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: 0.6, marginLeft: 8 },
  controls: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' },
  lang: { fontSize: 16, fontWeight: '600', letterSpacing: 0.5, marginRight: 16 },
  iconBtn: { padding: 8 },
  favBtnContainer: { marginVertical: 8, paddingHorizontal: 16, alignItems: 'center' },
  favBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  favBtnText: { fontSize: 17, fontWeight: 'bold' },
});

export default MainPage;
