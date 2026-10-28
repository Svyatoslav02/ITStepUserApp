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

const DEFAULT_PLACE_FILTERS = [
  { id: 'food', icon: 'silverware-fork-knife' },
  { id: 'culture', icon: 'drama-masks' },
  { id: 'nature', icon: 'tree' },
  { id: 'shopping', icon: 'shopping' },
  { id: 'entertainment', icon: 'movie-open' },
];

const formatReviewCount = (count) => new Intl.NumberFormat('uk-UA').format(count);

const PlaceCard = memo(({ place, city, liked, onPlacePress, onToggleLike, theme }) => {
  const image = place.photos?.[0] || place.image;
  const name = place.name || place.title || 'Місце без назви';

  return (
    <View style={[s.card, { backgroundColor: theme.card }]}>
      {image ? (
        <View style={s.imageContainer}>
          <TouchableOpacity onPress={() => onPlacePress?.(place)} activeOpacity={0.86} accessibilityRole="button" accessibilityLabel={`Відкрити деталі: ${name}`}>
            <Image source={{ uri: image }} style={s.image} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => sharePlace(place, city)} accessibilityRole="button" accessibilityLabel={`Поділитися місцем: ${name}`} style={s.shareLeft} activeOpacity={0.7}>
            <MaterialCommunityIcons name="share-variant" size={26} color="#fbbf24" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onToggleLike(place.id)} style={s.likeRight} activeOpacity={0.7} accessibilityLabel="Додати до обраного">
            <MaterialCommunityIcons name="heart" size={26} color={liked ? '#ef4444' : theme.inactiveHeart} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPlaceInMaps(place, city)} accessibilityRole="button" accessibilityLabel={`Відкрити ${name} у Google Maps`} style={[s.distanceBlock, { backgroundColor: '#1f1f1f' }]} activeOpacity={0.7}>
            <View style={s.distanceContent}>
              <Icon name="navigation" size={18} color="#fbbf24" />
              <Text style={s.distanceText}>Google Maps</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}

      <TouchableOpacity onPress={() => onPlacePress?.(place)} activeOpacity={0.78} style={s.content} accessibilityRole="button" accessibilityLabel={`Відкрити деталі: ${name}`}>
        <View style={s.titleRow}>
          <Text style={[s.itemTitle, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
          <Icon name="chevron-right" size={20} color={theme.text2} />
        </View>
        {place.description ? <Text style={[s.desc, { color: theme.text2 }]} numberOfLines={3}>{place.description}</Text> : null}
        {place.address ? (
          <View style={s.addressRow}>
            <Icon name="map-pin" size={18} color={theme.text2} style={s.icon} />
            <Text style={[s.detail, { color: theme.text2, flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">{place.address}</Text>
          </View>
        ) : null}
        {Number.isFinite(place.rating) || Number.isFinite(place.reviewCount) ? (
          <View style={s.metaRow}>
            {Number.isFinite(place.rating) ? (
              <View style={s.rating}>
                <Icon name="star" size={18} color="#fbbf24" />
                <Text style={[s.ratingText, { color: theme.text }]}>{place.rating.toFixed(1)}</Text>
              </View>
            ) : null}
            {Number.isFinite(place.reviewCount) ? (
              <Text style={[s.reviewCount, { color: theme.text2 }]}>{formatReviewCount(place.reviewCount)} відгуків</Text>
            ) : null}
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
});

const PlacesScreen = memo(({
  places,
  city,
  categories,
  header,
  theme,
  t,
  likedPlaces,
  onToggleLike,
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
    <ScrollView style={s.scroll} contentContainerStyle={s.section} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
      {header}
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
            liked={likedPlaces.has(place.id)}
            onPlacePress={onPlacePress}
            onToggleLike={onToggleLike}
            theme={theme}
          />
        ))
      )}
    </ScrollView>
  );
});

const s = StyleSheet.create({
  scroll: { flex: 1, minHeight: 0 },
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
  image: { width: '100%', height: 220, borderRadius: 14 },
  content: { paddingHorizontal: 6, paddingTop: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  itemTitle: { flex: 1, fontSize: 18, fontWeight: '700', marginRight: 8 },
  desc: { fontSize: 15, fontWeight: '500', marginBottom: 6 },
  filters: { flexDirection: 'row' },
  filtersContent: { paddingLeft: 0 },
  filter: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, marginRight: 12 },
  imageContainer: { position: 'relative' },
  shareLeft: { position: 'absolute', top: 10, left: 10 },
  likeRight: {
    position: 'absolute',
    top: 10,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceBlock: {
    position: 'absolute',
    bottom: 25,
    right: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  distanceContent: { flexDirection: 'row', alignItems: 'center' },
  distanceText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
  },
  empty: { padding: 28, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '600' },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 12, gap: 10 },
  detail: { fontSize: 15, fontWeight: '500' },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 15, fontWeight: '800', marginLeft: 5 },
  reviewCount: { fontSize: 14, fontWeight: '600' },
  icon: { marginRight: 6 },
});

export default PlacesScreen;
