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

const ACCOMMODATION_FILTERS = [
  { id: 'hotel', icon: 'office-building' },
  { id: 'motel', icon: 'caravan' },
  { id: 'hostel', icon: 'bunk-bed' },
];

const AccommodationCard = memo(({ accommodation, theme }) => (
  <View style={[s.card, { backgroundColor: theme.card }]}>
    <View style={s.imageContainer}>
      {accommodation.image && <Image source={{ uri: accommodation.image }} style={s.image} />}
      <TouchableOpacity onPress={() => {}} style={s.shareLeft} activeOpacity={0.7}>
        <MaterialCommunityIcons name="share-variant" size={26} color="#fbbf24" />
      </TouchableOpacity>
    </View>
    <View style={s.content}>
      <Text style={[s.itemTitle, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">
        {accommodation.title}
      </Text>
      {accommodation.description && (
        <Text style={[s.desc, { color: theme.text2 }]}>{accommodation.description}</Text>
      )}
      <View style={s.row}>
        <Icon name="map-pin" size={18} color={theme.text2} style={s.icon} />
        <Text style={[s.detail, { color: theme.text2, flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
          {accommodation.address}
        </Text>
        <View style={s.rating}>
          <Icon name="star" size={18} color="#fbbf24" style={s.icon} />
          <Text style={[s.detail, { color: theme.text2 }]}>{accommodation.rating.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  </View>
));

const AccommodationScreen = memo(({
  accommodation,
  theme,
  t,
  selectedFilter,
  onFilterChange,
}) => {
  const filtered = useMemo(
    () => accommodation?.filter((item) => item.type === selectedFilter) || [],
    [accommodation, selectedFilter]
  );

  return (
    <ScrollView contentContainerStyle={s.section} scrollEventThrottle={16}>
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
          <AccommodationCard key={item.id} accommodation={item} theme={theme} />
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
  empty: { padding: 28, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  detail: { fontSize: 15, fontWeight: '500' },
  rating: { flexDirection: 'row', alignItems: 'center', marginLeft: 14 },
  icon: { marginRight: 6 },
  imageContainer: { position: 'relative' },
  shareLeft: { position: 'absolute', top: 10, left: 10 },
});

export default AccommodationScreen;
