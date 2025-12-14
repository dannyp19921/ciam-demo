// frontend/src/components/StepUpModal.js
// Modal for step-up authentication flow
// Demonstrates additional verification for sensitive actions

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';
import { useCountdown } from '../hooks/useCountdown';

const VALID_DEMO_CODE = '123456';
const CODE_LENGTH = 6;
const COUNTDOWN_SECONDS = 30;

/**
 * Modal for step-up authentication
 * @param {boolean} visible - Modal visibility
 * @param {Object} action - Action requiring step-up
 * @param {Function} onConfirm - Callback when verified
 * @param {Function} onCancel - Callback when cancelled
 */
export function StepUpModal({ visible, action, onConfirm, onCancel }) {
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const { secondsLeft, isExpired, restart, reset } = useCountdown(COUNTDOWN_SECONDS);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setCode('');
      setCodeSent(false);
      reset();
    }
  }, [visible, reset]);

  const handleSendCode = () => {
    setCodeSent(true);
    restart();
  };

  const handleVerify = () => {
    // In production, this would verify with backend
    // For demo, accept "123456" or any 6-digit code
    if (code === VALID_DEMO_CODE || code.length === CODE_LENGTH) {
      onConfirm();
    }
  };

  const isCodeValid = code.length === CODE_LENGTH;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.icon}>🔐</Text>
          <Text style={styles.title}>Bekreft handling</Text>

          <View style={styles.actionBox}>
            <Text style={styles.actionIcon}>{action?.icon}</Text>
            <Text style={styles.actionName}>{action?.name}</Text>
          </View>

          <Text style={styles.description}>
            Denne handlingen krever ekstra bekreftelse for din sikkerhet.
            {'\n\n'}
            Dette kalles <Text style={styles.bold}>Step-up Authentication</Text> –
            sensitive handlinger krever sterkere autentisering enn vanlig navigering.
          </Text>

          {!codeSent ? (
            <SendCodeSection onSendCode={handleSendCode} />
          ) : (
            <VerifyCodeSection
              code={code}
              onChangeCode={setCode}
              secondsLeft={secondsLeft}
              isExpired={isExpired}
            />
          )}

          <View style={styles.buttons}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Avbryt</Text>
            </Pressable>
            {codeSent && (
              <Pressable
                style={[styles.confirmButton, !isCodeValid && styles.buttonDisabled]}
                onPress={handleVerify}
                disabled={!isCodeValid}
              >
                <Text style={styles.confirmButtonText}>Bekreft</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Hvorfor kreves dette?</Text>
            <Text style={styles.infoText}>
              • Beskytter mot uautoriserte endringer{'\n'}
              • Vanlig i bank og forsikring{'\n'}
              • Gjensidige bruker BankID for slike handlinger
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Section for sending verification code
 */
function SendCodeSection({ onSendCode }) {
  return (
    <View style={styles.sendCodeSection}>
      <Text style={styles.sendCodeText}>
        Vi sender en engangskode til din registrerte e-post/telefon.
      </Text>
      <Pressable style={styles.sendCodeButton} onPress={onSendCode}>
        <Text style={styles.sendCodeButtonText}>Send kode</Text>
      </Pressable>
    </View>
  );
}

/**
 * Section for entering and verifying code
 */
function VerifyCodeSection({ code, onChangeCode, secondsLeft, isExpired }) {
  return (
    <View style={styles.verifySection}>
      <Text style={styles.codeLabel}>Skriv inn 6-sifret kode:</Text>
      <TextInput
        style={styles.codeInput}
        value={code}
        onChangeText={onChangeCode}
        keyboardType="number-pad"
        maxLength={CODE_LENGTH}
        placeholder="000000"
        placeholderTextColor={COLORS.gray400}
      />
      <Text style={styles.timer}>
        {isExpired
          ? 'Koden er utløpt'
          : `Koden utløper om ${secondsLeft} sekunder`}
      </Text>
      <Text style={styles.demoHint}>
        Demo: Bruk kode "123456"
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  content: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.gray900,
    marginBottom: SPACING.lg,
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  actionName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  bold: {
    fontWeight: '600',
    color: COLORS.gray900,
  },
  sendCodeSection: {
    width: '100%',
    alignItems: 'center',
  },
  sendCodeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  sendCodeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.md,
  },
  sendCodeButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  verifySection: {
    width: '100%',
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray700,
    marginBottom: SPACING.sm,
  },
  codeInput: {
    backgroundColor: COLORS.gray50,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 8,
    width: 200,
    color: COLORS.gray900,
  },
  timer: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    marginTop: SPACING.sm,
  },
  demoHint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xl,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray700,
  },
  confirmButton: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  infoBox: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
  },
  infoTitle: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    lineHeight: 16,
  },
});
