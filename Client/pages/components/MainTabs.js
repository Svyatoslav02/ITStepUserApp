import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

export const MAIN_TABS = [
  { id: 'history', icon: 'clock' },
  { id: 'places', icon: 'map' },
  { id: 'accommodation', icon: 'moon' },
  { id: 'events', icon: 'calendar' },
];

const MainTabs = memo(({ activeTab, onTabPress, t, theme, isDarkMode }) => (
  <View style={s.tabContainer}>
    <View style={s.tabWrapper}>
      {MAIN_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const activeTextColor = isDarkMode ? '#000' : '#fff';
        const color = isActive ? activeTextColor : theme.text2;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            style={[s.tab, { backgroundColor: isActive ? theme.accent : theme.card }]}
            activeOpacity={0.82}
          >
            <Icon name={tab.icon} size={16} color={color} style={s.tabIcon} />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[s.tabText, { color }]}
            >
              {t[tab.id]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
));

const s = StyleSheet.create({
  tabContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  tabWrapper: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginHorizontal: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  tabIcon: { marginRight: 5 },
  tabText: { fontSize: 14, fontWeight: '700' },
});

export default MainTabs;
