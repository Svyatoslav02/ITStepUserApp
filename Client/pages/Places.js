import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';

const PlaceCard = memo(({ place, liked, toggleLike, theme }) => {
  return (
    <View style={[s.card, { backgroundColor: theme.card }]}>
      <View style={s.imageContainer}>
        {place.image && <Image source={{ uri: place.image }} style={s.image} />}

        {/* Поділитися */}
        <TouchableOpacity
          onPress={() => {}}
          style={s.shareLeft}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="share-variant"
            size={26}
            color="#fbbf24"
          />
        </TouchableOpacity>

        {/* Лайк */}
        <TouchableOpacity
          onPress={() => toggleLike(place.id)}
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

        {/* Блок "200м від вас" */}
        <TouchableOpacity
          onPress={() => {}}
          style={[s.distanceBlock, { backgroundColor:'#1f1f1f' }]}
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
  );
});

const PlacesWidget = memo(({ data, theme, t, likedPlaces, toggleLike, placesFilter, setPlacesFilter }) => {
  const filters = [
    { id: 'food', icon: 'silverware-fork-knife' },
    { id: 'culture', icon: 'drama-masks' },
    { id: 'nature', icon: 'tree' },
    { id: 'shopping', icon: 'shopping' },
    { id: 'entertainment', icon: 'movie-open' },
  ];

  const filtered = data.places?.filter((p) => p.type === placesFilter) || [];

  return (
    <ScrollView contentContainerStyle={s.section} scrollEventThrottle={16}>
      <View style={[s.card, { backgroundColor: theme.card }]}>
        <Text style={[s.title, { color: theme.text }]}>{t.places}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filters}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.id}
              onPress={() => setPlacesFilter(f.id)}
              style={[
                s.filter,
                placesFilter === f.id
                  ? { backgroundColor: theme.accent }
                  : { backgroundColor: theme.card, borderColor: theme.text2, borderWidth: 1 },
              ]}
            >
              <MaterialCommunityIcons
                name={f.icon}
                size={20}
                color={placesFilter === f.id ? theme.favBtnText : theme.text}
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
        filtered.map((p) => (
          <PlaceCard
            key={p.id}
            place={p}
            liked={likedPlaces.has(p.id)}
            toggleLike={toggleLike}
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
  filter: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, marginHorizontal: 6 },
  imageContainer: {
    position: 'relative',
  },
  shareLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  likeRight: {
    position: 'absolute',
    top: 10,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '600',
  },
  mapPin: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },

  distanceBlock: {
    position: 'absolute',
    bottom: 25,
    right: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff00',
  },
  distanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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

export default PlacesWidget;
