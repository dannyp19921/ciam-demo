// frontend/src/components/BottomNav.js
// Bottom navigation with SafeArea support and responsive web layout

import { View, Text, Pressable, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../styles/theme';

const NAV_ITEMS = [
  { key: 'home', icon: '🏠', label: 'Hjem' },
  { key: 'delegation', icon: '🤝', label: 'Fullmakt' },
  { key: 'api', icon: '🔑', label: 'API' },
  { key: 'security', icon: '🛡️', label: 'Sikkerhet' },
  { key: 'profile', icon: '👤', label: 'Profil' },
];

export function BottomNav({ activeTab, onTabChange }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const isWideScreen = width > 768;

  return (
    <View style={[
      styles.container, 
      { paddingBottom: Math.max(insets.bottom, SPACING.sm) },
      isWeb && isWideScreen && styles.containerWeb,
    ]}>
      <View style={[
        styles.navContent,
        isWeb && isWideScreen && styles.navContentWeb,
      ]}>
        {NAV_ITEMS.map((item) => (
          <Pressable
            key={item.key}
            style={[
              styles.item, 
              activeTab === item.key && styles.itemActive,
              isWeb && isWideScreen && styles.itemWeb,
            ]}
            onPress={() => onTabChange(item.key)}
          >
            <Text style={[styles.icon, isWeb && isWideScreen && styles.iconWeb]}>
              {item.icon}
            </Text>
            <Text style={[
              styles.label, 
              activeTab === item.key && styles.labelActive,
              isWeb && isWideScreen && styles.labelWeb,
            ]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
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
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  containerWeb: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.sm,
  },
  navContentWeb: {
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  itemWeb: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  icon: {
    fontSize: 18,
    marginBottom: 2,
  },
  iconWeb: {
    fontSize: 22,
    marginBottom: 4,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  labelWeb: {
    fontSize: FONT_SIZES.sm,
  },
});
