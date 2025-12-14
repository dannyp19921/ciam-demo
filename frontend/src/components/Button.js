// frontend/src/components/Button.js

import PropTypes from 'prop-types';
import { Pressable, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../styles/theme';

export function Button({ title, onPress, variant, disabled }) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const buttonStyle = [
    styles.base,
    styles[variant],
    disabled && styles.disabled,
    isDesktop && styles.desktop,
  ];

  return (
    <Pressable style={buttonStyle} onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'success', 'danger', 'secondary']),
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  variant: 'primary',
  disabled: false,
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  success: {
    backgroundColor: COLORS.success,
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  secondary: {
    backgroundColor: COLORS.gray200,
  },
  disabled: {
    backgroundColor: COLORS.gray300,
    opacity: 0.6,
  },
  desktop: {
    paddingVertical: SPACING.lg,
  },
  text: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});
