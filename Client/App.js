import 'react-native-gesture-handler';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainPage from './pages/MainPage';
import Saved from './pages/Saved';
import PlaceDetails from './pages/PlaceDetails';
import Donate from './pages/Donate';

import AppContext from './AppContext';

const Stack = createStackNavigator();
const cities = ['Івано-Франківськ', 'Львів', 'Київ'];

const makeTheme = (isDarkMode) => ({
  bg: isDarkMode ? '#121212' : '#f0f4f8',
  background: isDarkMode ? '#121212' : '#f0f4f8',
  card: isDarkMode ? '#1f1f1f' : '#ffffff',
  text: isDarkMode ? '#e5e5e5' : '#1f2937',
  text2: isDarkMode ? '#aaaaaa' : '#4b5563',
  accent: isDarkMode ? '#FFD700' : 'rgb(67, 80, 105)',
  banner: '#1f1f1f',
  bannerBackground: '#1f1f1f',
  bannerText: isDarkMode ? '#FFD700' : '#ffffff',
  inactiveHeart: isDarkMode ? '#444444' : '#1f2937',
  favBtnBg: isDarkMode ? '#FFD700' : '#1f2937',
  favBtnText: isDarkMode ? '#000000' : '#ffffff',
  shadow: isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)',
});

function CitySelectScreen({ navigation }) {
  const { language, setLanguage, isDarkMode, setIsDarkMode, theme } = React.useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDonateVisible, setIsDonateVisible] = useState(false);
  const filteredCities = cities.filter((city) => city.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: theme.banner }]}>
        <Text style={[styles.headerTitle, { color: theme.bannerText }]}>Оберіть місто</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setLanguage(language === 'uk' ? 'en' : 'uk')} style={styles.lang}>
            <Text style={{ color: theme.bannerText, fontWeight: '700' }}>{language === 'uk' ? 'EN' : 'UKR'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDonateVisible(true)} style={styles.iconBtn}>
            <Icon name="gift" size={24} color={theme.bannerText} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.iconBtn}>
            <Icon name={isDarkMode ? 'sun' : 'moon'} size={24} color={theme.bannerText} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.accent }]}>
        <Icon name="search" size={20} color={theme.text2} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Пошук міста..."
          placeholderTextColor={theme.text2}
          value={searchQuery}
          onChangeText={setSearchQuery}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredCities}
        keyExtractor={(city) => city}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { city: item })}
            style={[styles.cityItem, { backgroundColor: theme.card }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.cityText, { color: theme.text }]}>{item}</Text>
            <Icon name="map-pin" size={20} color={theme.accent} />
          </TouchableOpacity>
        )}
      />

      <Donate
        isVisible={isDonateVisible}
        onClose={() => setIsDonateVisible(false)}
        theme={theme}
        language={language}
      />
    </SafeAreaView>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState('uk');
  const [likedPlaces, setLikedPlaces] = useState(new Set());
  const theme = useMemo(() => makeTheme(isDarkMode), [isDarkMode]);
  const contextValue = useMemo(() => ({
    isDarkMode,
    setIsDarkMode,
    language,
    setLanguage,
    likedPlaces,
    setLikedPlaces,
    theme,
  }), [isDarkMode, language, likedPlaces, theme]);

  return (
    <AppContext.Provider value={contextValue}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="CitySelect" component={CitySelectScreen} />
          <Stack.Screen name="Main" component={MainPage} />
          <Stack.Screen name="Saved" component={Saved} />
          <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}

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
  headerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: 0.6 },
  controls: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' },
  lang: { marginRight: 12, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#777' },
  iconBtn: { padding: 8, alignItems: 'center', justifyContent: 'center' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 16,
    borderRadius: 16, borderWidth: 1.5, shadowOpacity: 0.15, shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  searchIcon: { marginLeft: 18, marginRight: 12 },
  searchInput: { flex: 1, fontSize: 17, paddingVertical: Platform.OS === 'ios' ? 14 : 10, paddingRight: 16, fontWeight: '500' },
  cityItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 18,
    marginBottom: 14, paddingVertical: 18, paddingHorizontal: 20, borderRadius: 16,
    shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 9,
  },
  cityText: { fontSize: 18, fontWeight: '700' },
});
