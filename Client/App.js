import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import AppContext from './AppContext';
import useCities from './services/useCities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCities } from './services/cityService';
import { EmptyState, ErrorState, LoadingState } from './pages/components/StateViews';

const Stack = createStackNavigator();
const SELECTED_CITY_KEY = 'selectedCity';

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
  const { isDarkMode, setIsDarkMode, theme, setSelectedCity } = React.useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const { cities, isLoading: isCitiesLoading, error: citiesError, retry: retryCities } = useCities();
  const filteredCities = cities.filter((city) => city.toLowerCase().includes(searchQuery.toLowerCase()));
  const cityListEmpty = isCitiesLoading ? (
    <LoadingState message="Завантаження міст…" theme={theme} />
  ) : citiesError ? (
    <ErrorState
      message="Не вдалося завантажити список міст. Перевірте інтернет-з’єднання."
      onRetry={retryCities}
      theme={theme}
    />
  ) : (
    <EmptyState message="Міст за цим пошуком не знайдено." theme={theme} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: theme.banner }]}>
        <Text style={[styles.headerTitle, { color: theme.bannerText }]}>Оберіть місто</Text>
        <View style={styles.controls}>
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
        ListEmptyComponent={cityListEmpty}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={async () => {
              await setSelectedCity(item);
              navigation.reset({ index: 0, routes: [{ name: 'Main', params: { city: item } }] });
            }}
            style={[styles.cityItem, { backgroundColor: theme.card }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.cityText, { color: theme.text }]}>{item}</Text>
            <Icon name="map-pin" size={20} color={theme.accent} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [likedPlaces, setLikedPlaces] = useState(new Set());
  const [selectedCity, setSelectedCityState] = useState(null);
  const [isCityReady, setIsCityReady] = useState(false);
  useEffect(() => {
    let isActive = true;
    Promise.all([AsyncStorage.getItem(SELECTED_CITY_KEY), getCities()])
      .then(([storedCity, cities]) => {
        if (!isActive) return;
        setSelectedCityState(cities.includes(storedCity) ? storedCity : null);
        setIsCityReady(true);
      })
      .catch(() => { if (isActive) setIsCityReady(true); });
    return () => { isActive = false; };
  }, []);
  const setSelectedCity = useCallback(async (city) => {
    await AsyncStorage.setItem(SELECTED_CITY_KEY, city);
    setSelectedCityState(city);
  }, []);
  const theme = useMemo(() => makeTheme(isDarkMode), [isDarkMode]);
  const contextValue = useMemo(() => ({
    isDarkMode,
    setIsDarkMode,
    likedPlaces,
    setLikedPlaces,
    selectedCity,
    setSelectedCity,
    theme,
  }), [isDarkMode, likedPlaces, selectedCity, setSelectedCity, theme]);

  return (
    <AppContext.Provider value={contextValue}>
      {!isCityReady ? (
        <View style={[styles.container, styles.loading, { backgroundColor: theme.bg }]}><ActivityIndicator color={theme.accent} /></View>
      ) : (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={selectedCity ? 'Main' : 'CitySelect'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CitySelect" component={CitySelectScreen} />
            <Stack.Screen name="Main" component={MainPage} initialParams={{ city: selectedCity }} />
            <Stack.Screen name="Saved" component={Saved} />
            <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { alignItems: 'center', justifyContent: 'center' },
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
