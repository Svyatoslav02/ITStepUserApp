import React, { memo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

const ProfileScreen = memo(({ likedCount, onOpenSaved, theme }) => (
  <ScrollView style={s.scroll} contentContainerStyle={s.section} showsVerticalScrollIndicator={false}>
    <TouchableOpacity onPress={onOpenSaved} activeOpacity={0.78} style={[s.savedButton, { backgroundColor: theme.card }]}>
      <View style={[s.icon, { backgroundColor: theme.accent }]}>
        <Icon name="heart" size={22} color={theme.favBtnText} />
      </View>
      <View style={s.content}>
        <Text style={[s.title, { color: theme.text }]}>Обрані місця</Text>
        <Text style={[s.count, { color: theme.text2 }]}>{likedCount} збережено</Text>
      </View>
      <Icon name="chevron-right" size={21} color={theme.text2} />
    </TouchableOpacity>
  </ScrollView>
));

const s = StyleSheet.create({
  scroll: { flex: 1, minHeight: 0 },
  section: { flexGrow: 1, padding: 18, paddingBottom: 48 },
  savedButton: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, elevation: 6 },
  icon: { width: 44, height: 44, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, marginHorizontal: 14 },
  title: { fontSize: 17, fontWeight: '800' },
  count: { fontSize: 13, fontWeight: '600', marginTop: 3 },
});

export default ProfileScreen;
