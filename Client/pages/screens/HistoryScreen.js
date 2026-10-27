import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

const HistoryScreen = memo(({ items, theme, t }) => {
  if (!items || items.length === 0) {
    return (
      <View style={[s.card, { backgroundColor: theme.card }]}>
        <Text style={[s.title, { color: theme.text }]}>
          {t.history} {t.unavailable}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={s.section}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
    >
      {items.map((item, index) => (
        <View key={`${item.title}-${index}`} style={[s.historyCard, { backgroundColor: theme.card }]}>
          {item.image && <Image source={{ uri: item.image }} style={s.historyImage} />}
          <Text style={[s.historyTitle, { color: theme.text }]}>{item.title}</Text>
          {item.text.split('\n').map((para, idx) => (
            <Text key={idx} style={[s.historyText, { color: theme.text2 }]}>
              {para.trim()}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
});

const s = StyleSheet.create({
  section: { flexGrow: 1, paddingBottom: 48, paddingHorizontal: 18 },
  card: {
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 7,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 14 },
  historyCard: {
    padding: 20,
    borderRadius: 14,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  historyTitle: { fontSize: 22, fontWeight: '800', marginBottom: 12, letterSpacing: 0.5 },
  historyText: { fontSize: 16, fontWeight: '500', lineHeight: 24, marginBottom: 10 },
  historyImage: { width: '100%', height: 240, borderRadius: 16, marginBottom: 16, resizeMode: 'cover' },
});

export default HistoryScreen;
