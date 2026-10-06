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

const PLACE_FILTERS = [
  { id: 'food', icon: 'silverware-fork-knife' },
  { id: 'culture', icon: 'drama-masks' },
  { id: 'nature', icon: 'tree' },
  { id: 'shopping', icon: 'shopping' },
  { id: 'entertainment', icon: 'movie-open' },
];

const PlaceCard = memo(({ place, liked, onToggleLike, theme }) => (
  <View style={[s.card, { backgroundColor: theme.card }]}>
    <View style={s.imageContainer}>
      {place.image && <Image source={{ uri: place.image }} style={s.image} />}

      <TouchableOpacity onPress={() => {}} style={s.shareLeft} activeOpacity={0.7}>
        <MaterialCommunityIcons name="share-variant" size={26} color="#fbbf24" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onToggleLike(place.id)}
        style={s.likeRight}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="heart"
          size={26}
          color={liked ? '#ef4444' : theme.inactiveHeart}
        />
        <Text style={[s.likeCount, { color: theme.text2 }]}>{place.likes}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {}}
        style={[s.distanceBlock, { backgroundColor: '#1f1f1f' }]}
        activeOpacity={0.7}
      >
        <View style={s.distanceContent}>
          <Icon name="navigation" size={18} color="#fbbf24" />
          <Text style={s.distanceText}>200м від вас</Text>
        </View>
      </TouchableOpacity>
    </View>

    <View style={s.content}>
      <Text style={[s.itemTitle, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">
        {place.name}
      </Text>
      {place.description && <Text style={[s.desc, { color: theme.text2 }]}>{place.description}</Text>}
      <View style={s.row}>
        <Icon name="map-pin" size={18} color={theme.text2} style={s.icon} />
        <Text style={[s.detail, { color: theme.text2, flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
          {place.address}
        </Text>
        <View style={s.rating}>
          <Icon name="star" size={18} color="#fbbf24" style={s.icon} />
          <Text style={[s.detail, { color: theme.text2 }]}>{place.rating.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  </View>
));

const PlacesScreen = memo(({
  places,
  theme,
  t,
  likedPlaces,
  onToggleLike,
  selectedFilter,
  onFilterChange,
}) => {
  const filtered = useMemo(
    () => places?.filter((place) => place.type === selectedFilter) || [],
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
          {PLACE_FILTERS.map((filter) => (
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
            liked={likedPlaces.has(place.id)}
            onToggleLike={onToggleLike}
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
  content: { paddingHorizontal: 6 },
  itemTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
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
  likeCount: { marginLeft: 6, fontSize: 15, fontWeight: '600' },
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
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  detail: { fontSize: 15, fontWeight: '500' },
  rating: { flexDirection: 'row', alignItems: 'center', marginLeft: 14 },
  icon: { marginRight: 6 },
});

export default PlacesScreen;
