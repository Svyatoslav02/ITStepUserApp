import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MainPage from './pages/MainPage.js';
import Donate from './pages/Donate.js';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState('uk');
  const [currentScreen, setCurrentScreen] = useState('citySelect');
  const [selectedCity, setSelectedCity] = useState('Івано-Франківськ');
  const [isDonateModalVisible, setIsDonateModalVisible] = useState(false);

  const t = {
    selectCity: 'Оберіть місто',
    searchCity: 'Пошук міста...',
  };

  const cities = ['Івано-Франківськ', 'Львів', 'Київ'];
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentScreen('main');
  };

  const darkTheme = {
    bg: '#121212',
    card: '#1f1f1f',
    text: '#e5e5e5',
    text2: '#aaaaaa',
    accent: '#FFD700',
    banner: '#1f1f1f',
    bannerText: '#FFD700',
    inactiveHeart: '#444444',
    favBtnBg: '#FFD700',
    favBtnText: '#000000',
    shadow: 'rgba(0,0,0,0.4)',
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
    shadow: 'rgba(0,0,0,0.1)',
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleSupport = () => {
    setIsDonateModalVisible(true);
  };

  // === Animation for full screen ===
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // === Animation for city list on search change ===
  const listOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(listOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(listOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [searchQuery]);

  if (currentScreen === 'main') {
    return (
      <MainPage
        selectedCity={selectedCity}
        onBackPress={() => setCurrentScreen('citySelect')}
        language={language}
        isDarkMode={isDarkMode}
        setLanguage={setLanguage}
        setIsDarkMode={setIsDarkMode}
      />
    );
  }

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={[styles.header, { backgroundColor: theme.banner, shadowColor: theme.shadow }]}>
          <Text style={[styles.headerTitle, { color: theme.bannerText }]}>{t.selectCity}</Text>
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => setLanguage(language === 'uk' ? 'en' : 'uk')}
              style={[
                styles.lang,
                {
                  borderColor: isDarkMode ? theme.accent : '#bbb',
                  backgroundColor: isDarkMode ? '#1f1f1f' : 'transparent',
                },
              ]}
            >
              <Text style={{ color: theme.bannerText, fontWeight: '700' }}>
                {language === 'uk' ? 'EN' : 'UKR'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSupport} style={styles.donateBtn}>
              <Icon name="gift" size={24} color={theme.bannerText} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.iconBtn}>
              <Icon name={isDarkMode ? 'sun' : 'moon'} size={24} color={theme.bannerText} />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: isDarkMode ? 'rgba(31,31,31,0.85)' : 'rgba(255,255,255,0.9)',
              borderColor: theme.accent,
              shadowColor: theme.shadow,
            },
          ]}
        >
          <Icon name="search" size={20} color={theme.text2} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={t.searchCity}
            placeholderTextColor={theme.text2}
            value={searchQuery}
            onChangeText={setSearchQuery}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        <Animated.View style={{ flex: 1, opacity: listOpacity }}>
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <AnimatedCityItem
                item={item}
                index={index}
                theme={theme}
                onPress={() => handleCitySelect(item)}
                lastItem={index === filteredCities.length - 1}
              />
            )}
          />
        </Animated.View>

        <Donate
          isVisible={isDonateModalVisible}
          onClose={() => setIsDonateModalVisible(false)}
          theme={theme}
          language={language}
        />
      </SafeAreaView>
    </Animated.View>
  );
};

// === Animated item ===
const AnimatedCityItem = ({ item, index, theme, onPress, lastItem }) => {
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY }], opacity }}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.cityItem,
          {
            backgroundColor: theme.card,
            shadowColor: theme.shadow,
            marginBottom: lastItem ? 18 : 14,
          },
        ]}
        activeOpacity={0.7}
      >
        <Text style={[styles.cityText, { color: theme.text }]}>{item}</Text>
        <Icon name="map-pin" size={20} color={theme.accent} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    margin: 12,
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  lang: {
    fontSize: 16,
    letterSpacing: 0.5,
    marginRight: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  iconBtn: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  searchIcon: {
    marginLeft: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    paddingRight: 16,
    fontWeight: '500',
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 9,
  },
  cityText: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default App;
