import React, { useContext } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import AppContext from '../AppContext';

export default function PlaceDetails({ navigation, route }) {
  const { isDarkMode, theme } = useContext(AppContext);
  const { place, city } = route.params;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: theme.banner }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Назад">
          <Icon name="chevron-left" size={24} color={theme.bannerText} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={[styles.headerTitle, { color: theme.bannerText }]}>{place.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {place.image ? <Image source={{ uri: place.image }} style={styles.image} /> : null}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>{place.name}</Text>
          {place.description ? <Text style={[styles.body, { color: theme.text2 }]}>{place.description}</Text> : null}
          <View style={styles.detailRow}>
            <Icon name="map-pin" size={20} color={theme.accent} />
            <Text style={[styles.body, styles.detailText, { color: theme.text2 }]}>{place.address || city}</Text>
          </View>
          {Number.isFinite(place.rating) ? (
            <View style={styles.detailRow}>
              <Icon name="star" size={20} color="#fbbf24" />
              <Text style={[styles.body, styles.detailText, { color: theme.text2 }]}>{place.rating.toFixed(1)}</Text>
            </View>
          ) : null}
          {place.type ? <Text style={[styles.category, { color: theme.accent }]}>{place.type}</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, margin: 12, borderRadius: 12, elevation: 5 },
  backButton: { padding: 6 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', marginLeft: 4 },
  content: { paddingBottom: 32 },
  image: { width: '100%', height: 260, resizeMode: 'cover' },
  card: { padding: 20, margin: 16, borderRadius: 14, elevation: 4 },
  title: { fontSize: 23, fontWeight: '800', marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 24 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  detailText: { flex: 1, marginLeft: 10 },
  category: { marginTop: 18, fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
});
