import React, { memo, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { MaterialCommunityIcons, Feather as Icon } from '@expo/vector-icons';
import { openPlaceInMaps, sharePlace } from '../../utils/placeActions';
import { getSavedPlaceKey } from '../../services/useSavedPlaces';
import PlaceDistanceButton from '../../components/PlaceDistanceButton';

const DEFAULT_PLACE_FILTERS = [
  { id: 'food', icon: 'silverware-fork-knife' },
  { id: 'culture', icon: 'drama-masks' },
  { id: 'nature', icon: 'tree' },
  { id: 'shopping', icon: 'shopping' },
  { id: 'entertainment', icon: 'movie-open' },
];

function getPlaceImage(place) {
  const photo = Array.isArray(place?.photos) ? place.photos[0] : null;
  const image = photo || place?.image;
  if (typeof image === 'string') return { uri: image };
  if (image && typeof image === 'object' && image.uri) return image;
  return null;
}

const PlaceCard = memo(({ place, city, language, isSaved, onPlacePress, onToggleSaved, theme }) => {
  const imageSource = getPlaceImage(place);
  const rating = Number(place?.rating);

  return (
    <View style={[s.card, { backgroundColor: theme.card }]}>
      <View style={s.imageContainer}>
        {imageSource ? <Image source={imageSource} style={s.image} /> : <View style={[s.image, s.imagePlaceholder, { backgroundColor: theme.bg }]} />}

        <TouchableOpacity
          onPress={() => sharePlace(place, city)}
          accessibilityRole="button"
          accessibilityLabel={`Поділитися місцем: ${place.name}`}
          style={s.shareLeft}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="share-variant" size={26} color="#fbbf24" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onToggleSaved(place.id)}
          style={s.likeRight}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? `Видалити з обраного: ${place.name}` : `Додати до обраного: ${place.name}`}
        >
          <MaterialCommunityIcons
            name={isSaved ? 'heart' : 'heart-outline'}
            size={26}
            color={isSaved ? '#ef4444' : theme.inactiveHeart}
          />
        </TouchableOpacity>

        <PlaceDistanceButton
          place={place}
          city={city}
          language={language}
          style={s.distanceAction}
          textStyle={s.distanceText}
        />
        <TouchableOpacity
          onPress={() => openPlaceInMaps(place, city)}
          accessibilityRole="button"
          accessibilityLabel={`Відкрити ${place.name} у Google Maps`}
          style={[s.distanceBlock, { backgroundColor: '#1f1f1f' }]}
          activeOpacity={0.7}
        >
          <View style={s.distanceContent}>
            <Icon name="navigation" size={18} color="#fbbf24" />
            <Text style={s.distanceText}>Google Maps</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={s.content}>
        <TouchableOpacity onPress={() => onPlacePress?.(place)} activeOpacity={0.7}>
          <Text style={[s.itemTitle, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">
            {place.name || 'Місце без назви'}
          </Text>
        </TouchableOpacity>
        {place.description ? <Text style={[s.desc, { color: theme.text2 }]}>{place.description}</Text> : null}
        <View style={s.row}>
          <Icon name="map-pin" size={18} color={theme.text2} style={s.icon} />
          <Text style={[s.detail, { color: theme.text2, flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
            {place.address || ''}
          </Text>
          {Number.isFinite(rating) ? (
            <View style={s.rating}>
              <Icon name="star" size={18} color="#fbbf24" style={s.icon} />
              <Text style={[s.detail, { color: theme.text2 }]}>{rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
});

const PlacesScreen = memo(({
  places,
  city,
  categories,
  theme,
  t,
  language,
  savedPlaceKeys,
  onToggleSaved,
  onPlacePress,
  selectedFilter,
  onFilterChange,
}) => {
  const filters = categories?.length ? categories : DEFAULT_PLACE_FILTERS;
  const filtered = useMemo(
    () => places?.filter((place) => (place.category || place.type) === selectedFilter) || [],
    [places, selectedFilter]
  );

  return (
    <ScrollView contentContainerStyle={s.section} scrollEventThrottle={16}>
      <View style={[s.card, { backgroundColor: theme.card }]}>
        <Text style={[s.title, { color: theme.text }]}>{t.places}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filters}
          contentContainerStyle={s.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => onFilterChange(filter.id)}
              style={[
                s.filter,
                selectedFilter === filter.id
                  ? { backgroundColor: theme.accent }
                  : { backgroundColor: theme.card, borderColor: theme.text2, borderWidth: 1 },
              ]}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={filter.name || filter.id}
            >
              <MaterialCommunityIcons
                name={filter.icon}
                size={20}
                color={selectedFilter === filter.id ? theme.favBtnText : theme.text}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filtered.length === 0 ? (
        <View style={s.empty}>
          <Text style={[s.emptyText, { color: theme.text2 }]}>{t.placesUnavailable}</Text>
        </View>
      ) : (
        filtered.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            city={city}
            language={language}
            isSaved={savedPlaceKeys.has(getSavedPlaceKey(city, place.id))}
            onPlacePress={onPlacePress}
            onToggleSaved={onToggleSaved}
            theme={theme}
          />
        ))
      )}
    </ScrollView>
  );
});

const s = StyleSheet.create({
  section: { flexGrow: 1, paddingBottom: 48 },
  card: {
    padding: 18,
    borderRadius: 14,
    marginHorizontal: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 14 },
  image: { width: '100%', height: 220, borderRadius: 14, marginBottom: 14 },
  imagePlaceholder: { opacity: 0.5 },
  content: { paddingHorizontal: 6 },
  itemTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  desc: { fontSize: 15, fontWeight: '500', marginBottom: 6 },
  filters: { flexDirection: 'row' },
  filtersContent: { paddingLeft: 0 },
  filter: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, marginRight: 12 },
  imageContainer: { position: 'relative' },
  shareLeft: { position: 'absolute', top: 10, left: 10 },
  likeRight: { position: 'absolute', top: 10, right: 8, flexDirection: 'row', alignItems: 'center' },
  distanceBlock: { position: 'absolute', bottom: 25, right: 10, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
  distanceAction: { position: 'absolute', bottom: 25, left: 10, flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#1f1f1f' },
  distanceContent: { flexDirection: 'row', alignItems: 'center' },
  distanceText: { marginLeft: 6, fontSize: 14, fontWeight: '600', color: '#fbbf24' },
  empty: { padding: 28, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  detail: { fontSize: 15, fontWeight: '500' },
  rating: { flexDirection: 'row', alignItems: 'center', marginLeft: 14 },
  icon: { marginRight: 6 },
});

export default PlacesScreen;
