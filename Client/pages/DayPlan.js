import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather as Icon, MaterialCommunityIcons } from '@expo/vector-icons';
import AppContext from '../AppContext';
import { EmptyState } from './components/StateViews';
import { openPlaceInMaps } from '../utils/placeActions';
import { calculateDistanceMeters, formatDistance } from '../utils/dayPlanDistance';

function DayPlanStop({
  stop,
  index,
  totalStops,
  nextStop,
  theme,
  moveStop,
  removeStop,
  updateVisitMinutes,
}) {
  const [visitTimeDraft, setVisitTimeDraft] = useState(String(stop.visitMinutes));
  const distanceToNext = nextStop
    ? calculateDistanceMeters(stop.coordinates, nextStop.coordinates)
    : null;

  useEffect(() => {
    setVisitTimeDraft(String(stop.visitMinutes));
  }, [stop.visitMinutes]);

  const saveVisitTime = () => {
    const minutes = Number.parseInt(visitTimeDraft, 10);
    if (!Number.isFinite(minutes)) {
      setVisitTimeDraft(String(stop.visitMinutes));
      return;
    }

    const safeMinutes = Math.min(480, Math.max(5, minutes));
    setVisitTimeDraft(String(safeMinutes));
    updateVisitMinutes(stop.city, stop.placeId, safeMinutes);
  };

  const handleOpenInMaps = async () => {
    try {
      await openPlaceInMaps(stop, stop.city);
    } catch {
      Alert.alert('Не вдалося відкрити карту', 'Спробуйте відкрити це місце ще раз.');
    }
  };

  return (
    <View style={[styles.stopCard, { backgroundColor: theme.card }]}>
      <View style={styles.stopHeader}>
        {stop.photo ? <Image source={{ uri: stop.photo }} style={styles.stopImage} /> : null}
        <View style={styles.stopTitleBlock}>
          <Text style={[styles.stopNumber, { color: theme.accent }]}>Зупинка {index + 1}</Text>
          <Text style={[styles.stopTitle, { color: theme.text }]} numberOfLines={2}>
            {stop.name}
          </Text>
          {stop.address ? (
            <Text style={[styles.stopAddress, { color: theme.text2 }]} numberOfLines={2}>
              {stop.address}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.visitTimeRow}>
        <Text style={[styles.label, { color: theme.text2 }]}>Час на місці, хв:</Text>
        <TextInput
          accessibilityLabel={`Час відвідування: ${stop.name}`}
          keyboardType="number-pad"
          maxLength={3}
          onBlur={saveVisitTime}
          onChangeText={(value) => setVisitTimeDraft(value.replace(/\D/g, ''))}
          onSubmitEditing={saveVisitTime}
          returnKeyType="done"
          selectTextOnFocus
          style={[styles.visitTimeInput, { color: theme.text, borderColor: theme.text2 }]}
          value={visitTimeDraft}
        />
      </View>

      {nextStop ? (
        <View style={[styles.distanceRow, { borderTopColor: theme.text2 }]}>
          <MaterialCommunityIcons name="map-marker-distance" size={20} color={theme.accent} />
          <Text style={[styles.distanceText, { color: theme.text2 }]}>
            {distanceToNext === null
              ? `До «${nextStop.name}»: відстань недоступна без координат`
              : `До «${nextStop.name}»: ≈ ${formatDistance(distanceToNext)} по прямій`}
          </Text>
        </View>
      ) : (
        <View style={[styles.distanceRow, { borderTopColor: theme.text2 }]}>
          <MaterialCommunityIcons name="flag-checkered" size={20} color={theme.accent} />
          <Text style={[styles.distanceText, { color: theme.text2 }]}>Остання зупинка</Text>
        </View>
      )}

      <View style={styles.actionsRow}>
        <View style={styles.orderActions}>
          <TouchableOpacity
            accessibilityLabel="Перемістити зупинку вгору"
            accessibilityRole="button"
            accessibilityState={{ disabled: index === 0 }}
            disabled={index === 0}
            onPress={() => moveStop(stop.city, stop.placeId, -1)}
            style={[styles.orderButton, { borderColor: theme.text2, opacity: index === 0 ? 0.4 : 1 }]}
          >
            <Icon name="arrow-up" size={19} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Перемістити зупинку вниз"
            accessibilityRole="button"
            accessibilityState={{ disabled: index === totalStops - 1 }}
            disabled={index === totalStops - 1}
            onPress={() => moveStop(stop.city, stop.placeId, 1)}
            style={[styles.orderButton, { borderColor: theme.text2, opacity: index === totalStops - 1 ? 0.4 : 1 }]}
          >
            <Icon name="arrow-down" size={19} color={theme.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          accessibilityLabel={`Відкрити ${stop.name} у Google Maps`}
          accessibilityRole="button"
          onPress={handleOpenInMaps}
          style={[styles.mapButton, { backgroundColor: theme.accent }]}
        >
          <Icon name="map-pin" size={17} color={theme.favBtnText} />
          <Text style={[styles.mapButtonText, { color: theme.favBtnText }]}>Google Maps</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel={`Видалити ${stop.name} з плану`}
          accessibilityRole="button"
          onPress={() => removeStop(stop.city, stop.placeId)}
          style={[styles.removeButton, { borderColor: '#ef4444' }]}
        >
          <Icon name="trash-2" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DayPlan({ navigation }) {
  const {
    dayPlan,
    moveDayPlanStop,
    removeDayPlanStop,
    updateDayPlanVisitMinutes,
    isDarkMode,
    theme,
    selectedCity,
  } = useContext(AppContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { backgroundColor: theme.banner }]}>
        <TouchableOpacity
          accessibilityLabel="Назад"
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-left" size={24} color={theme.bannerText} />
        </TouchableOpacity>
        <View style={styles.headerTitleBlock}>
          <Text style={[styles.headerTitle, { color: theme.bannerText }]}>План дня</Text>
          <Text style={[styles.headerSubtitle, { color: theme.text2 }]}>
            {selectedCity || 'Ваш маршрут'}
          </Text>
        </View>
        <Text style={[styles.stopCount, { color: theme.bannerText }]}>{dayPlan.length}</Text>
      </View>

      {dayPlan.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState message="Додайте місця до плану дня зі списку місць." theme={theme} framed={false} />
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={[styles.browseButton, { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.browseButtonText, { color: theme.favBtnText }]}>До списку місць</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
          {dayPlan.map((stop, index) => (
            <DayPlanStop
              key={`${stop.city}-${stop.placeId}`}
              stop={stop}
              index={index}
              totalStops={dayPlan.length}
              nextStop={dayPlan[index + 1] || null}
              theme={theme}
              moveStop={moveDayPlanStop}
              removeStop={removeDayPlanStop}
              updateVisitMinutes={updateDayPlanVisitMinutes}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 14, margin: 12, borderRadius: 12, elevation: 5 },
  backButton: { padding: 6 },
  headerTitleBlock: { flex: 1, marginLeft: 6 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  stopCount: { fontSize: 18, fontWeight: '700', paddingHorizontal: 8 },
  list: { paddingHorizontal: 12, paddingBottom: 32 },
  stopCard: { borderRadius: 14, padding: 14, marginBottom: 12, elevation: 3 },
  stopHeader: { flexDirection: 'row', alignItems: 'center' },
  stopImage: { width: 64, height: 64, borderRadius: 10, marginRight: 12 },
  stopTitleBlock: { flex: 1 },
  stopNumber: { fontSize: 13, fontWeight: '700', marginBottom: 3 },
  stopTitle: { fontSize: 17, fontWeight: '700' },
  stopAddress: { fontSize: 13, marginTop: 4 },
  visitTimeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  label: { fontSize: 14, fontWeight: '600', marginRight: 10 },
  visitTimeInput: { minWidth: 64, paddingVertical: 5, paddingHorizontal: 8, borderWidth: 1, borderRadius: 8, textAlign: 'center', fontSize: 16 },
  distanceRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, marginTop: 12 },
  distanceText: { flex: 1, fontSize: 13, marginLeft: 8, lineHeight: 18 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  orderActions: { flexDirection: 'row', marginRight: 'auto' },
  orderButton: { width: 38, height: 38, borderWidth: 1, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginRight: 7 },
  mapButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 11, borderRadius: 9, marginRight: 8 },
  mapButtonText: { fontSize: 13, fontWeight: '700', marginLeft: 6 },
  removeButton: { width: 38, height: 38, borderWidth: 1, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  browseButton: { paddingVertical: 11, paddingHorizontal: 18, borderRadius: 10, marginTop: 14 },
  browseButtonText: { fontSize: 15, fontWeight: '700' },
});
