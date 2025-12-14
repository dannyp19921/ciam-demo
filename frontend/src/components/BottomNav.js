// src/components/BottomNav.js

import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../styles/theme';

const NAV_ITEMS = [
  { key: 'home', icon: '🏠', label: 'Hjem' },
  { key: 'delegation', icon: '🤝', label: 'Fullmakt' },
  { key: 'api', icon: '🔑', label: 'API' },
  { key: 'security', icon: '🛡️', label: 'Sikkerhet' },
  { key: 'profile', icon: '👤', label: 'Profil' },
];

export function BottomNav({ activeTab, onTabChange }) {
  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => (
        <Pressable
          key={item.key}
          style={[styles.item, activeTab === item.key && styles.itemActive]}
          onPress={() => onTabChange(item.key)}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={[styles.label, activeTab === item.key && styles.labelActive]}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  item: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  itemActive: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.lg,
  },
  icon: {
    fontSize: 18,
    marginBottom: 2,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});