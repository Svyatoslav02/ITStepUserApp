import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons, Feather as Icon } from '@expo/vector-icons';

const Saved = ({ likedPlaces, placesData, language, isDarkMode, toggleLike, onBackPress }) => {
  const [placesFilter, setPlacesFilter] = useState('food');
  const scrollViewRef = useRef(null);

  const t = {
    favorites: 'Обрані місця',
    noFavorites: 'Немає обраних місць',
    back: 'Назад',
    rating: 'Рейтинг',
    address: 'Адреса',
    places: 'Місця',
    placesUnavailable: 'Місця недоступні',
    food: 'Їжа',
    culture: 'Культура',
    nature: 'Природа',
    shopping: 'Шопінг',
    entertainment: 'Розваги',
    sport: 'Спорт',
  };

  const darkTheme = {
    background: '#121212',
    card: '#1f1f1f',
    text: '#e5e5e5',
    text2: '#aaaaaa',
    accent: '#FFD700',
    bannerBackground: '#1f1f1f',
    bannerText: '#FFD700',
    inactiveHeart: '#1f1f1f',
  };

  const lightTheme = {
    background: '#f0f4f8',
    card: '#ffffff',
    text: '#1f2937',
    text2: '#4b5563',
    accent: 'rgb(67, 80, 105)',
    bannerBackground: '#1f2937',
    bannerText: '#ffffff',
    inactiveHeart: '#1f2937',
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const filters = [
    { id: 'food', icon: 'silverware-fork-knife' },
    { id: 'culture', icon: 'drama-masks' },
    { id: 'nature', icon: 'tree' },
    { id: 'shopping', icon: 'shopping' },
    { id: 'entertainment', icon: 'movie-open' },
  ];

  const filteredFavorites = useMemo(
    () =>
      placesData
        ? placesData.filter((place) => likedPlaces.has(place.id) && place.type === placesFilter)
        : [],
    [placesData, likedPlaces, placesFilter]
  );

  const animations = useMemo(
    () =>
      filteredFavorites.map(() => ({
        fadeAnim: new Animated.Value(0),
        slideAnim: new Animated.Value(20),
      })),
    [filteredFavorites.length]
  );

  useEffect(() => {
    const animationArray = animations.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim.fadeAnim, {
          toValue: 1,
          duration: 300,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(anim.slideAnim, {
          toValue: 0,
          duration: 300,
          delay: index * 50,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(50, animationArray).start();
  }, [animations]);

  if (!placesData || placesData.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={[styles.header, { backgroundColor: theme.bannerBackground }]}>
          <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={theme.bannerText} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.bannerText }]}>{t.favorites}</Text>
        </View>
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: theme.text2 }]}>{t.placesUnavailable}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: theme.bannerBackground }]}>
        <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.bannerText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.bannerText }]}>{t.favorites}</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.section}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
      >
        {/* Кнопка "Переглянути карту" */}
        <View style={styles.mapButtonContainer}>
          <TouchableOpacity style={[styles.mapButton, { backgroundColor: theme.accent }]}>
            <Text style={styles.mapButtonText}>Переглянути карту</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>{t.places}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f.id}
                onPress={() => setPlacesFilter(f.id)}
                style={[
                  styles.filter,
                  placesFilter === f.id
                    ? { backgroundColor: theme.accent }
                    : { backgroundColor: theme.card, borderColor: theme.text2, borderWidth: 1 },
                ]}
              >
                <MaterialCommunityIcons
                  name={f.icon}
                  size={20}
                  color={placesFilter === f.id ? (isDarkMode ? '#000000' : '#ffffff') : theme.text}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {filteredFavorites.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.text2 }]}>{t.placesUnavailable}</Text>
          </View>
        ) : (
          filteredFavorites.map((item, index) => (
            <Animated.View
              key={item.id}
              style={{
                opacity: animations[index]?.fadeAnim,
                transform: [{ translateY: animations[index]?.slideAnim }],
              }}
            >
              <View style={[styles.card, { backgroundColor: theme.card }]}>
                <View style={styles.imageContainer}>
                  {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
                  <TouchableOpacity onPress={() => {}} style={styles.shareLeft} activeOpacity={0.7}>
                    <MaterialCommunityIcons name="share-variant" size={26} color="#fbbf24" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.like} activeOpacity={0.7}>
                    <MaterialCommunityIcons
                      name={likedPlaces.has(item.id) ? 'heart' : 'heart-outline'}
                      size={26}
                      color={likedPlaces.has(item.id) ? '#ef4444' : theme.inactiveHeart}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {}} style={styles.distanceBlock} activeOpacity={0.7}>
                    <View style={styles.distanceContent}>
                      <Icon name="navigation" size={18} color="#fbbf24" />
                      <Text style={styles.distanceText}>200м від вас</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.content}>
                  <Text style={[styles.itemTitle, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                  </Text>
                  {item.description && (
                    <Text style={[styles.desc, { color: theme.text2 }]}>{item.description}</Text>
                  )}
                  <View style={styles.row}>
                    <Icon name="map-pin" size={18} color={theme.text2} style={styles.icon} />
                    <Text
                      style={[styles.detail, { color: theme.text2, flex: 1 }]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.address}
                    </Text>
                    <View style={styles.rating}>
                      <Icon name="star" size={18} color="#fbbf24" style={styles.icon} />
                      <Text style={[styles.detail, { color: theme.text2 }]}>{item.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    margin: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', letterSpacing: 0.5, marginLeft: 8 },
  iconButton: { padding: 8, alignItems: 'center', justifyContent: 'center' },
  section: { flexGrow: 1, paddingBottom: 48 },
  card: {
    padding: 18,
    borderRadius: 14,
    marginHorizontal: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  mapButtonContainer: {
    paddingHorizontal: 18,
    marginTop: 10,
  },
  mapButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 14 },
  filters: { flexDirection: 'row' },
  filter: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  imageContainer: { position: 'relative' },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 14,
  },
  shareLeft: { position: 'absolute', top: 10, left: 8 },
  like: { position: 'absolute', top: 10, right: 10, flexDirection: 'row', alignItems: 'center' },
  content: { paddingHorizontal: 6 },
  itemTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  desc: { fontSize: 15, fontWeight: '500', marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  detail: { fontSize: 15, fontWeight: '500' },
  rating: { flexDirection: 'row', alignItems: 'center', marginLeft: 14 },
  icon: { marginRight: 6 },
  empty: { padding: 28, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '600' },
  distanceBlock: {
    position: 'absolute',
    bottom: 25,
    right: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#1f1f1f',
  },
  distanceContent: { flexDirection: 'row', alignItems: 'center' },
  distanceText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
  },
});

export default Saved;
