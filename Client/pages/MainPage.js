import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import cityData from './Data';
import Saved from './Saved';
import PlacesWidget from './Places';
import AccommodationWidget from './AccommodationWidget';
import EventsWidget from './Events';
import Donate from './Donate';
import WeatherWidget from './Weather';

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

  const t = {
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
    unavailable: 'недоступна',
    placesUnavailable: 'Місця недоступні',
    rating: 'Рейтинг',
    address: 'Адреса',
    description: 'Опис',
  };

  const darkTheme = {
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

  const lightTheme = {
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

  const theme = isDarkMode ? darkTheme : lightTheme;

  const data = {
    weather: cityData[selectedCity]?.weather.uk,
    places: cityData[selectedCity]?.places.uk,
    history: cityData[selectedCity]?.history.uk,
    accommodation: cityData[selectedCity]?.accommodation.uk,
    events: cityData[selectedCity]?.events.uk,
  };

  const handleSupport = () => {
    setIsDonateVisible(true);
  };

  const handleCloseDonate = () => {
    setIsDonateVisible(false);
  };

  const toggleLike = (id) => {
    setLikedPlaces((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const GenericWidget = ({ dataKey, title }) => {
    const items = data[dataKey] || [];
    if (!items || items.length === 0) {
      return (
        <View style={[s.card, { backgroundColor: theme.card }]}>
          <Text style={[s.title, { color: theme.text }]}>{t[title]} {t.unavailable}</Text>
        </View>
      );
    }
    if (dataKey === 'history') {
      return (
        <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 18 }} showsVerticalScrollIndicator={false}>
          {items.map((item, i) => (
            <View key={i} style={[s.historyCard, { backgroundColor: theme.card }]}>
              {item.image && <Image source={{ uri: item.image }} style={s.historyImage} />}
              <Text style={[s.historyTitle, { color: theme.text }]}>{item.title}</Text>
              {item.text.split('\n').map((para, idx) => (
                <Text key={idx} style={[s.historyText, { color: theme.text2 }]}>{para.trim()}</Text>
              ))}
            </View>
          ))}
        </ScrollView>
      );
    }
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {items.map((item, i) => (
          <View key={i} style={[s.card, { backgroundColor: theme.card }]}>
            {item.image && <Image source={{ uri: item.image }} style={s.image} />}
            <View style={s.content}>
              <Text style={[s.itemTitle, { color: theme.text }]}>{item.title}</Text>
              <Text style={[s.itemText, { color: theme.text2 }]}>{item.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const tabs = [
    { id: 'history', icon: 'clock', widget: <GenericWidget dataKey="history" title="history" /> },
    {
      id: 'places',
      icon: 'map',
      widget: (
        <PlacesWidget
          data={data}
          theme={theme}
          t={t}
          likedPlaces={likedPlaces}
          toggleLike={toggleLike}
          placesFilter={placesFilter}
          setPlacesFilter={setPlacesFilter}
        />
      ),
    },
    {
      id: 'accommodation',
      icon: 'moon',
      widget: (
        <AccommodationWidget
          data={data}
          theme={theme}
          t={t}
          accommodationFilter={accommodationFilter}
          setAccommodationFilter={setAccommodationFilter}
        />
      ),
    },
    {
      id: 'events',
      icon: 'calendar',
      widget: (
        <EventsWidget
          data={data}
          theme={theme}
          t={t}
          eventsFilter={eventsFilter}
          setEventsFilter={setEventsFilter}
        />
      ),
    },
  ];

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

      <View style={s.tabContainer}>
        <View style={s.tabWrapper}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[s.tab, { backgroundColor: activeTab === tab.id ? theme.accent : theme.card }]}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  s.tabText,
                  {
                    color:
                      activeTab === tab.id
                        ? isDarkMode
                          ? '#000'
                          : '#fff'
                        : theme.text2,
                  },
                ]}
              >
                {t[tab.id]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {tabs.find((tab) => tab.id === activeTab)?.widget}
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
  tabContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  tabWrapper: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginHorizontal: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  tabText: { fontSize: 15, marginLeft: 6, fontWeight: '700' },
  card: {
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 7,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 14 },
  image: { width: '100%', height: 200, borderRadius: 14, marginBottom: 14 },
  content: { paddingHorizontal: 6 },
  itemTitle: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  itemText: { fontSize: 15, fontWeight: '500' },
  historyCard: {
    padding: 20,
    borderRadius: 14,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  historyTitle: { fontSize: 22, fontWeight: '800', marginBottom: 12, letterSpacing: 0.5 },
  historyText: { fontSize: 16, fontWeight: '500', lineHeight: 24, marginBottom: 10 },
  historyImage: { width: '100%', height: 240, borderRadius: 16, marginBottom: 16, resizeMode: 'cover' },
});

export default MainPage;