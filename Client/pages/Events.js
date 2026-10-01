import React, { memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

const EventCard = memo(({ event, theme, t }) => {
  return (
    <View style={[s.card, { backgroundColor: theme.card }]}>
      {event.image && <Image source={{ uri: event.image }} style={s.image} />}
      <View style={s.content}>
        <Text style={[s.itemTitle, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">
          {event.title}
        </Text>
        {event.description && <Text style={[s.desc, { color: theme.text2 }]}>{event.description}</Text>}
        <View style={s.row}>
          <Icon name="calendar" size={18} color={theme.text2} style={s.icon} />
          <Text style={[s.detail, { color: theme.text2, flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
            {event.date}
          </Text>
        </View>
        <View style={s.row}>
          <Icon name="map-pin" size={18} color={theme.text2} style={s.icon} />
          <Text style={[s.detail, { color: theme.text2, flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">
            {event.address}
          </Text>
        </View>
      </View>
    </View>
  );
});

const EventsWidget = memo(({ data, theme, t }) => {
  const events = data.events || [];

  return (
    <ScrollView contentContainerStyle={s.section} scrollEventThrottle={16}>
      <View style={[s.card, { backgroundColor: theme.card }]}>
        <Text style={[s.title, { color: theme.text }]}>{t.events}</Text>
      </View>
      {events.length === 0 ? (
        <View style={s.empty}>
          <Text style={[s.emptyText, { color: theme.text2 }]}>{t.placesUnavailable}</Text>
        </View>
      ) : (
        events.map((e) => (
          <EventCard
            key={e.id}
            event={e}
            theme={theme}
            t={t}
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
  empty: { padding: 28, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  detail: { fontSize: 15, fontWeight: '500' },
  icon: { marginRight: 6 },
});

export default EventsWidget;
