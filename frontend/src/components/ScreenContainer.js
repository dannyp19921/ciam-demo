// frontend/src/components/ScreenContainer.js
// Wrapper component for consistent screen layout with SafeArea and responsive web support

import { ScrollView, View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../styles/theme';

/**
 * Container component for screen content
 * Responsive: Full width on mobile, max 900px centered on web
 */
export function ScreenContainer({ 
  children, 
  title, 
  subtitle, 
  scroll = true,
  style 
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  
  const isWeb = Platform.OS === 'web';
  const isWideScreen = width > 768;

  const containerStyle = [
    styles.container,
    {
      paddingTop: Math.max(insets.top + SPACING.lg, 60),
      paddingBottom: Math.max(insets.bottom + 80, 100),
    },
    isWeb && isWideScreen && styles.containerWeb,
    style,
  ];

  const content = (
    <>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      {children}
    </>
  );

  if (scroll) {
    return (
      <ScrollView 
        contentContainerStyle={containerStyle}
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View style={[containerStyle, styles.noScroll]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.gray100,
  },
  containerWeb: {
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: SPACING.xxl,
  },
  noScroll: {
    flex: 1,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray500,
    marginTop: SPACING.xs,
  },
});
