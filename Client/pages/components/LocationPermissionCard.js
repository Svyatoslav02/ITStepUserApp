import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

function getStatus(location) {
  if (location.permissionStatus === 'unknown') {
    return { title: 'Перевіряємо доступ до геолокації…', detail: '', icon: 'map-pin', color: null };
  }
  if (location.permissionStatus === 'denied') {
    return {
      title: 'Доступ до геолокації вимкнено',
      detail: 'Застосунок працює далі. За бажанням доступ можна дозволити пізніше.',
      icon: 'map-pin',
      color: '#f59e0b',
    };
  }
  if (location.permissionStatus === 'unavailable' || location.locationStatus === 'unavailable') {
    return {
      title: location.permissionStatus === 'granted' ? 'Не вдалося визначити місце' : 'Геолокація недоступна',
      detail: location.permissionStatus === 'granted'
        ? 'Доступ надано, але координати зараз недоступні. Перевірте геолокацію на пристрої та повторіть спробу.'
        : 'Перевірте налаштування геолокації на пристрої та спробуйте ще раз.',
      icon: 'alert-circle',
      color: '#ef4444',
    };
  }
  if (location.locationStatus === 'loading') {
    return { title: 'Визначаємо місцезнаходження…', detail: '', icon: 'map-pin', color: null };
  }
  if (location.locationStatus === 'available' && location.coordinates) {
    return {
      title: 'Місцезнаходження визначено',
      detail: `${location.coordinates.latitude.toFixed(4)}, ${location.coordinates.longitude.toFixed(4)}`,
      icon: 'check-circle',
      color: '#22c55e',
    };
  }
  return {
    title: 'Увімкніть геолокацію за бажанням',
    detail: 'Вона потрібна, щоб визначати відстань до місць поруч.',
    icon: 'map-pin',
    color: null,
  };
}

export default function LocationPermissionCard({ location, theme }) {
  const status = getStatus(location);
  const isLoading = location.permissionStatus === 'unknown' || location.locationStatus === 'loading';
  const mustOpenSettings = location.permissionStatus === 'denied' && !location.canAskAgain;
  const buttonLabel = isLoading
    ? 'Зачекайте…'
    : mustOpenSettings
      ? 'Налаштування'
      : location.locationStatus === 'available'
        ? 'Оновити'
        : location.permissionStatus === 'denied'
          ? 'Спробувати ще раз'
          : location.permissionStatus === 'unavailable'
            ? 'Спробувати знову'
            : 'Увімкнути';

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.statusRow}>
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.accent} />
        ) : (
          <Icon name={status.icon} size={20} color={status.color || theme.accent} />
        )}
        <View style={styles.copy}>
          <Text style={[styles.title, { color: theme.text }]}>{status.title}</Text>
          {status.detail ? <Text style={[styles.detail, { color: theme.text2 }]}>{status.detail}</Text> : null}
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={buttonLabel}
          disabled={isLoading}
          onPress={mustOpenSettings ? location.openLocationSettings : location.requestLocation}
          style={[styles.button, { backgroundColor: theme.accent, opacity: isLoading ? 0.55 : 1 }]}
        >
          <Text style={[styles.buttonText, { color: theme.favBtnText }]}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, marginHorizontal: 16, marginBottom: 10, padding: 12, elevation: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  copy: { flex: 1, marginHorizontal: 10 },
  title: { fontSize: 14, fontWeight: '700' },
  detail: { fontSize: 12, lineHeight: 17, marginTop: 3 },
  button: { borderRadius: 9, paddingHorizontal: 11, paddingVertical: 9 },
  buttonText: { fontSize: 13, fontWeight: '700' },
});
