// frontend/src/styles/theme.js
// Mobile-first design system for CIAM Demo

// ---------------------
// COLOR PALETTE
// ---------------------
export const COLORS = {
  // Primary brand colors
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#93c5fd',
  primaryBg: '#eff6ff',

  // Semantic colors
  success: '#16a34a',
  successLight: '#22c55e',
  successBg: '#dcfce7',

  warning: '#d97706',
  warningLight: '#f59e0b',
  warningBg: '#fef3c7',

  danger: '#dc2626',
  dangerLight: '#ef4444',
  dangerBg: '#fee2e2',

  info: '#0891b2',
  infoBg: '#cffafe',

  // Neutral palette
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

// ---------------------
// SPACING SCALE
// ---------------------
// Base unit: 4px (mobile-first)
export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  section: 48,
};

// ---------------------
// TYPOGRAPHY
// ---------------------
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// ---------------------
// BORDER RADIUS
// ---------------------
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

// ---------------------
// SHADOWS (Elevation)
// ---------------------
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// ---------------------
// TOUCH TARGETS
// ---------------------
// Apple HIG: minimum 44pt, Material Design: minimum 48dp
export const TOUCH_TARGETS = {
  minimum: 44,
  comfortable: 48,
  large: 56,
};

// ---------------------
// LAYOUT
// ---------------------
export const LAYOUT = {
  screenPaddingHorizontal: SPACING.lg,
  screenPaddingVertical: SPACING.xl,
  cardPadding: SPACING.lg,
  sectionGap: SPACING.xxl,
  itemGap: SPACING.md,
};

// ---------------------
// ANIMATION
// ---------------------
export const ANIMATION = {
  fast: 150,
  normal: 250,
  slow: 350,
};

// ---------------------
// COMMON STYLES
// ---------------------
// Reusable style objects to reduce duplication across components

export const COMMON_STYLES = {
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.gray100,
  },

  screenContent: {
    flex: 1,
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: LAYOUT.cardPadding,
    ...SHADOWS.md,
  },

  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },

  bodyText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.gray700,
    lineHeight: FONT_SIZES.md * LINE_HEIGHTS.normal,
  },

  caption: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.gray500,
  },

  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.gray200,
    marginVertical: SPACING.md,
  },
};
