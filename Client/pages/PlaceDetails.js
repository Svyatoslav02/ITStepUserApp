import React, { useContext, useMemo } from 'react';
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import AppContext from '../AppContext';
import usePlace from '../services/usePlace';

const categoryLabels = {
  food: 'Їжа',
  culture: 'Культура',
  nature: 'Природа',
  shopping: 'Шопінг',
  entertainment: 'Розваги',
  hotel: 'Готель',
  hotels: 'Готель',
  motel: 'Мотель',
  hostel: 'Хостел',
};

const socialIcons = {
  facebook: 'facebook',
  instagram: 'instagram',
  telegram: 'send',
  twitter: 'twitter',
  tiktok: 'music',
};

const hasText = (value) => typeof value === 'string' && value.trim().length > 0;
const formatReviewCount = (count) => new Intl.NumberFormat('uk-UA').format(count);

const normalizeUrl = (url) => {
  if (!hasText(url)) return null;
  return /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
};

const getSocialLinks = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (typeof item === 'string') return { id: `social-${index}`, label: 'Соцмережа', url: normalizeUrl(item), type: 'link' };
        if (!item || typeof item !== 'object') return null;
        return {
          id: item.id || `${item.type || item.label || 'social'}-${index}`,
          label: item.label || item.type || 'Соцмережа',
          url: normalizeUrl(item.url),
          type: String(item.type || '').toLowerCase(),
        };
      })
      .filter((item) => item?.url);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([type, url]) => ({ id: type, label: type, type: type.toLowerCase(), url: normalizeUrl(url) }))
      .filter((item) => item.url);
  }

  return [];
};

const getWorkingHours = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (typeof item === 'string') return hasText(item) ? { id: `hours-${index}`, label: '', value: item.trim() } : null;
        if (!item || typeof item !== 'object') return null;
        const label = item.label || item.days || item.day || '';
        const hours = item.value || item.hours || item.time || '';
        return hours !== null && hours !== undefined && hasText(String(hours))
          ? { id: item.id || `hours-${index}`, label: String(label), value: String(hours) }
          : null;
      })
      .filter(Boolean);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value)
      .filter(([, hours]) => hours !== null && hours !== undefined && hasText(String(hours)))
      .map(([days, hours]) => ({ id: days, label: days, value: String(hours) }));
  }

  return hasText(value) ? [{ id: 'hours', label: '', value: value.trim() }] : [];
};

const openLink = async (url) => {
  if (!url) return;
  try {
    await Linking.openURL(url);
  } catch {
    return;
  }
};

export default function PlaceDetails({ navigation, route }) {
  const { isDarkMode, theme, selectedCity } = useContext(AppContext);
  const { placeId } = route.params;
  const city = selectedCity || route.params.city;
  const { place, isLoading, error } = usePlace(city, placeId, 'uk');

  const details = useMemo(() => {
    if (!place) return null;
    const photos = [...new Set([...(place.photos || []), place.image].filter(hasText))];
    const phone = place.phone || place.contacts?.phone || null;
    const website = normalizeUrl(place.website || place.contacts?.website);
    const socialLinks = getSocialLinks(place.socialLinks || place.contacts?.socialLinks || place.contacts?.social);
    const workingHours = getWorkingHours(place.workingHours);
    return { photos, phone: hasText(phone) ? phone.trim() : null, website, socialLinks, workingHours };
  }, [place]);

  if (isLoading || !place || !details) {
    return (
      <SafeAreaView style={[styles.container, styles.loading, { backgroundColor: theme.bg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.loadingBackButton} accessibilityLabel="Назад">
          <Icon name="chevron-left" size={24} color={theme.bannerText} />
        </TouchableOpacity>
        <Text style={[styles.body, { color: theme.text2 }]}>
          {isLoading ? 'Завантаження місця…' : error ? 'Не вдалося завантажити місце.' : 'Місце не знайдено.'}
        </Text>
      </SafeAreaView>
    );
  }

  const hasRating = Number.isFinite(place.rating);
  const hasReviewCount = Number.isFinite(place.reviewCount);
  const hasContacts = details.phone || details.website || details.socialLinks.length > 0;
  const phoneUrl = details.phone ? `tel:${details.phone.replace(/[^+\d]/g, '')}` : null;
  const websiteLabel = details.website?.replace(/^https?:\/\//i, '').replace(/\/$/, '');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: theme.banner }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Назад">
          <Icon name="chevron-left" size={24} color={theme.bannerText} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={[styles.headerTitle, { color: theme.bannerText }]}>{place.name || 'Місце без назви'}</Text>
      </View>

      <ScrollView style={[styles.scroll, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {details.photos[0] ? (
          <View style={styles.heroFrame}>
            <Image source={{ uri: details.photos[0] }} style={styles.heroImage} />
          </View>
        ) : null}

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          {place.category ? (
            <Text style={[styles.category, { color: theme.accent }]}>{categoryLabels[place.category] || place.category}</Text>
          ) : null}
          <Text style={[styles.title, { color: theme.text }]}>{place.name || 'Місце без назви'}</Text>
          {hasRating || hasReviewCount ? (
            <View style={styles.ratingRow}>
              {hasRating ? (
                <View style={styles.ratingItem}>
                  <Icon name="star" size={18} color="#fbbf24" />
                  <Text style={[styles.ratingText, { color: theme.text }]}>{place.rating.toFixed(1)}</Text>
                </View>
              ) : null}
              {hasReviewCount ? <Text style={[styles.reviewText, { color: theme.text2 }]}>{formatReviewCount(place.reviewCount)} відгуків</Text> : null}
            </View>
          ) : null}
          {place.description ? <Text style={[styles.description, { color: theme.text2 }]}>{place.description}</Text> : null}
          {place.address ? (
            <View style={styles.detailRow}>
              <Icon name="map-pin" size={20} color={theme.accent} />
              <Text style={[styles.body, styles.detailText, { color: theme.text2 }]}>{place.address}</Text>
            </View>
          ) : null}
        </View>

        {hasContacts ? (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Контакти</Text>
            {details.phone ? (
              <TouchableOpacity onPress={() => openLink(phoneUrl)} style={[styles.actionRow, { borderColor: theme.text2 }]} accessibilityRole="link">
                <View style={[styles.actionIcon, { backgroundColor: theme.accent }]}><Icon name="phone" size={19} color={theme.favBtnText} /></View>
                <View style={styles.actionContent}>
                  <Text style={[styles.actionLabel, { color: theme.text2 }]}>Телефон</Text>
                  <Text style={[styles.actionValue, { color: theme.text }]}>{details.phone}</Text>
                </View>
                <Icon name="external-link" size={18} color={theme.text2} />
              </TouchableOpacity>
            ) : null}
            {details.website ? (
              <TouchableOpacity onPress={() => openLink(details.website)} style={[styles.actionRow, { borderColor: theme.text2 }]} accessibilityRole="link">
                <View style={[styles.actionIcon, { backgroundColor: theme.accent }]}><Icon name="globe" size={19} color={theme.favBtnText} /></View>
                <View style={styles.actionContent}>
                  <Text style={[styles.actionLabel, { color: theme.text2 }]}>Вебсайт</Text>
                  <Text numberOfLines={1} style={[styles.actionValue, { color: theme.text }]}>{websiteLabel}</Text>
                </View>
                <Icon name="external-link" size={18} color={theme.text2} />
              </TouchableOpacity>
            ) : null}
            {details.socialLinks.length > 0 ? (
              <View style={styles.socialList}>
                {details.socialLinks.map((social) => (
                  <TouchableOpacity key={social.id} onPress={() => openLink(social.url)} style={[styles.socialButton, { borderColor: theme.text2 }]} accessibilityRole="link">
                    <Icon name={socialIcons[social.type] || 'link'} size={18} color={theme.accent} />
                    <Text style={[styles.socialText, { color: theme.text }]}>{social.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {details.workingHours.length > 0 ? (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.sectionHeading}>
              <Icon name="clock" size={20} color={theme.accent} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Години роботи</Text>
            </View>
            {details.workingHours.map((item) => (
              <View key={item.id} style={styles.hoursRow}>
                {item.label ? <Text style={[styles.hoursLabel, { color: theme.text2 }]}>{item.label}</Text> : null}
                <Text style={[styles.hoursValue, { color: theme.text }]}>{item.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {details.photos.length > 1 ? (
          <View style={[styles.card, styles.galleryCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, styles.galleryTitle, { color: theme.text }]}>Ще фото</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery}>
              {details.photos.slice(1).map((photo, index) => (
                <Image key={`${place.id}-photo-${index + 1}`} source={{ uri: photo }} style={styles.galleryImage} />
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0 },
  loading: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingBackButton: { position: 'absolute', left: 18, top: 18, padding: 8 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, margin: 12, borderRadius: 12, elevation: 5 },
  backButton: { padding: 6 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '700', marginHorizontal: 6 },
  scroll: { flex: 1, minHeight: 0 },
  content: { flexGrow: 1, paddingBottom: 48 },
  heroFrame: { aspectRatio: 16 / 9, marginHorizontal: 16, borderRadius: 14, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  card: { padding: 18, marginHorizontal: 16, marginTop: 12, borderRadius: 14, elevation: 4 },
  category: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '800' },
  body: { fontSize: 16, lineHeight: 24 },
  description: { fontSize: 16, lineHeight: 24, marginTop: 16 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  ratingItem: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 16, fontWeight: '800', marginLeft: 6 },
  reviewText: { fontSize: 14, fontWeight: '600', marginLeft: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 18 },
  detailText: { flex: 1, marginLeft: 10 },
  sectionTitle: { fontSize: 19, fontWeight: '800' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  actionRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 12 },
  actionIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionContent: { flex: 1, marginHorizontal: 12 },
  actionLabel: { fontSize: 12, fontWeight: '600' },
  actionValue: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  socialList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  socialButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12 },
  socialText: { fontSize: 14, fontWeight: '700', marginLeft: 8 },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 18, paddingVertical: 9 },
  hoursLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  hoursValue: { fontSize: 15, fontWeight: '700', textAlign: 'right' },
  galleryCard: { paddingHorizontal: 0, overflow: 'hidden' },
  galleryTitle: { paddingHorizontal: 20 },
  gallery: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 2, gap: 12 },
  galleryImage: { width: 210, height: 140, borderRadius: 10, resizeMode: 'cover' },
});
