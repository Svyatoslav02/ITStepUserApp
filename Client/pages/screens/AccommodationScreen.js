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
import { sharePlace } from '../../utils/placeActions';

const ACCOMMODATION_FILTERS = [
  { id: 'hotel', icon: 'office-building' },
  { id: 'motel', icon: 'caravan' },
  { id: 'hostel', icon: 'bunk-bed' },
];

const formatReviewCount = (count) => new Intl.NumberFormat('uk-UA').format(count);

const AccommodationCard = memo(({ accommodation, city, liked, onPress, onToggleLike, theme }) => {
  const image = accommodation.photos?.[0] || accommodation.image;
  const name = accommodation.name || accommodation.title || 'Місце без назви';

  return (
    <View style={[s.card, { backgroundColor: theme.card }]}>
      {image ? (
        <View style={s.imageContainer}>
          <TouchableOpacity onPress={() => onPress?.(accommodation)} activeOpacity={0.86} accessibilityRole="button" accessibilityLabel={`Відкрити деталі: ${name}`}>
            <Image source={{ uri: image }} style={s.image} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => sharePlace(accommodation, city)} accessibilityRole="button" accessibilityLabel={`Поділитися місцем: ${name}`} style={s.shareLeft} activeOpacity={0.7}>
            <MaterialCommunityIcons name="share-variant" size={26} color="#fbbf24" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onToggleLike(accommodation.id)} accessibilityRole="button" accessibilityLabel={liked ? 'Прибрати з обраного' : 'Додати до обраного'} style={s.likeRight} activeOpacity={0.7}>
            <MaterialCommunityIcons name="heart" size={26} color={liked ? '#ef4444' : theme.inactiveHeart} />
          </TouchableOpacity>
        </View>
      ) : null}
      <TouchableOpacity onPress={() => onPress?.(accommodation)} activeOpacity={0.78} style={s.content} accessibilityRole="button" accessibilityLabel={`Відкрити деталі: ${name}`}>
        <View style={s.titleRow}>
          <Text style={[s.itemTitle, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
          <Icon name="chevron-right" size={20} color={theme.text2} />
        </View>
        {accommodation.description ? <Text style={[s.desc, { color: theme.text2 }]} numberOfLines={3}>{accommodation.description}</Text> : null}
        {accommodation.address ? (
          <View style={s.addressRow}>
            <Icon name="map-pin" size={18} color={theme.text2} style={s.icon} />
            <Text style={[s.detail, { color: theme.text2, flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">{accommodation.address}</Text>
          </View>
        ) : null}
        {Number.isFinite(accommodation.rating) || Number.isFinite(accommodation.reviewCount) ? (
          <View style={s.metaRow}>
            {Number.isFinite(accommodation.rating) ? (
              <View style={s.rating}>
                <Icon name="star" size={18} color="#fbbf24" />
                <Text style={[s.ratingText, { color: theme.text }]}>{accommodation.rating.toFixed(1)}</Text>
              </View>
            ) : null}
            {Number.isFinite(accommodation.reviewCount) ? (
              <Text style={[s.reviewCount, { color: theme.text2 }]}>{formatReviewCount(accommodation.reviewCount)} відгуків</Text>
            ) : null}
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
});

const AccommodationScreen = memo(({
  accommodation,
  city,
  likedPlaces,
  theme,
  t,
  selectedFilter,
  onFilterChange,
  onAccommodationPress,
  onToggleLike,
}) => {
  const filtered = useMemo(
    () => accommodation?.filter((item) => (item.category || item.type) === selectedFilter) || [],
    [accommodation, selectedFilter]
  );

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.section} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
      <View style={[s.card, { backgroundColor: theme.card }]}>
        <Text style={[s.title, { color: theme.text }]}>{t.accommodation}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filters}
          contentContainerStyle={s.filtersContent}
        >
          {ACCOMMODATION_FILTERS.map((filter) => (
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
        filtered.map((item) => (
          <AccommodationCard
            key={item.id}
            accommodation={item}
            city={city}
            liked={likedPlaces.has(item.id)}
            onPress={onAccommodationPress}
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
  empty: { padding: 28, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '600' },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 12, gap: 10 },
  detail: { fontSize: 15, fontWeight: '500' },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 15, fontWeight: '800', marginLeft: 5 },
  reviewCount: { fontSize: 14, fontWeight: '600' },
  icon: { marginRight: 6 },
  imageContainer: { position: 'relative' },
  shareLeft: { position: 'absolute', top: 10, left: 10 },
  likeRight: { position: 'absolute', top: 10, right: 10 },
});

export default AccommodationScreen;
