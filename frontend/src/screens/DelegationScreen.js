// frontend/src/screens/DelegationScreen.js
// Screen for managing delegated access (fullmakt)

import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Card, InfoBox, StepUpModal, ScreenContainer } from '../components';
import { generateUserDelegations, SENSITIVE_ACTIONS } from '../services/userData';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

/**
 * Delegation screen component
 */
export function DelegationScreen({ user }) {
  const [stepUpVisible, setStepUpVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [completedActions, setCompletedActions] = useState([]);

  const delegations = generateUserDelegations(user?.sub);

  const handleActionPress = (action) => {
    if (action.requiresStepUp) {
      setSelectedAction(action);
      setStepUpVisible(true);
    } else {
      setCompletedActions([...completedActions, action.id]);
    }
  };

  const handleStepUpConfirm = () => {
    setCompletedActions([...completedActions, selectedAction.id]);
    setStepUpVisible(false);
    setSelectedAction(null);
  };

  const handleStepUpCancel = () => {
    setStepUpVisible(false);
    setSelectedAction(null);
  };

  return (
    <ScreenContainer
      title="🤝 Fullmakter"
      subtitle="Administrer hvem som har tilgang til dine forsikringer"
    >
      <Card title="Hva er fullmakt?">
        <Text style={styles.explanationText}>
          En fullmakt lar deg gi andre personer tilgang til å se eller administrere
          dine forsikringer på dine vegne. Dette er nyttig for:
        </Text>
        <Text style={styles.useCaseText}>
          • <Text style={styles.bold}>Familie:</Text> Ektefelle eller barn kan hjelpe hverandre{'\n'}
          • <Text style={styles.bold}>Regnskapsfører:</Text> Kan se bedriftens forsikringer{'\n'}
          • <Text style={styles.bold}>Verge:</Text> Kan håndtere forsikringer for andre
        </Text>
      </Card>

      <Card title="📤 Fullmakter du har gitt">
        {delegations.givenTo.length > 0 ? (
          delegations.givenTo.map((delegation) => (
            <DelegationItem key={delegation.id} delegation={delegation} type="given" />
          ))
        ) : (
          <Text style={styles.emptyText}>Du har ikke gitt fullmakt til noen.</Text>
        )}

        <Pressable
          style={styles.addButton}
          onPress={() => handleActionPress(SENSITIVE_ACTIONS.find((a) => a.id === 'add_delegation'))}
        >
          <Text style={styles.addButtonText}>+ Gi fullmakt til noen</Text>
        </Pressable>
      </Card>

      <Card title="📥 Fullmakter du har mottatt">
        {delegations.receivedFrom.length > 0 ? (
          delegations.receivedFrom.map((delegation) => (
            <DelegationItem key={delegation.id} delegation={delegation} type="received" />
          ))
        ) : (
          <Text style={styles.emptyText}>Du har ikke mottatt fullmakt fra noen.</Text>
        )}
      </Card>

      <Card title="🔐 Step-up Authentication Demo">
        <Text style={styles.stepUpExplanation}>
          Noen handlinger krever ekstra bekreftelse. Prøv å klikke på handlingene
          nedenfor for å se hvordan Step-up Authentication fungerer.
        </Text>

        <View style={styles.actionsList}>
          {SENSITIVE_ACTIONS.map((action) => (
            <ActionItem
              key={action.id}
              action={action}
              isCompleted={completedActions.includes(action.id)}
              onPress={() => handleActionPress(action)}
            />
          ))}
        </View>

        <Legend />
      </Card>

      <InfoBox title="💡 Slik gjør Gjensidige det" variant="primary">
        Gjensidige bruker BankID for step-up authentication:{'\n\n'}
        • Se forsikringer → Vanlig innlogging{'\n'}
        • Signere avtaler → Krever BankID{'\n'}
        • Endre kontaktinfo → Krever BankID{'\n'}
        • Gi fullmakt → Krever BankID{'\n\n'}
        I denne demoen simulerer vi dette med en engangskode.
      </InfoBox>

      <StepUpModal
        visible={stepUpVisible}
        action={selectedAction}
        onConfirm={handleStepUpConfirm}
        onCancel={handleStepUpCancel}
      />
    </ScreenContainer>
  );
}

function DelegationItem({ delegation, type }) {
  const isGiven = type === 'given';
  const initials = delegation.name.split(' ').map((n) => n[0]).join('');

  return (
    <View style={styles.delegationItem}>
      <View style={styles.delegationHeader}>
        <View style={[styles.avatarSmall, !isGiven && styles.avatarReceived]}>
          <Text style={styles.avatarSmallText}>{initials}</Text>
        </View>
        <View style={styles.delegationInfo}>
          <Text style={styles.delegationName}>{delegation.name}</Text>
          <Text style={styles.delegationRelation}>{delegation.relationship}</Text>
        </View>
        {isGiven && (
          <View style={[styles.accessBadge, delegation.accessLevel === 'full' && styles.accessBadgeFull]}>
            <Text style={styles.accessBadgeText}>
              {delegation.accessLevel === 'full' ? 'Full' : 'Lese'}
            </Text>
          </View>
        )}
      </View>

      {isGiven ? (
        <>
          <View style={styles.delegationDetails}>
            <Text style={styles.delegationDetailLabel}>Tilgang til:</Text>
            <Text style={styles.delegationDetailValue}>{delegation.accessTypes.join(', ')}</Text>
          </View>
          <View style={styles.delegationDetails}>
            <Text style={styles.delegationDetailLabel}>Gyldig fra:</Text>
            <Text style={styles.delegationDetailValue}>
              {delegation.grantedDate}
              {delegation.expiresDate ? ` til ${delegation.expiresDate}` : ' (permanent)'}
            </Text>
          </View>
          <Pressable style={styles.revokeButton}>
            <Text style={styles.revokeButtonText}>Trekk tilbake</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.receivedNote}>
            Du kan se og administrere {delegation.name}s {delegation.accessTypes.join(' og ').toLowerCase()}
          </Text>
          <Pressable style={styles.switchProfileButton}>
            <Text style={styles.switchProfileButtonText}>Bytt til denne profilen →</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

function ActionItem({ action, isCompleted, onPress }) {
  return (
    <Pressable
      style={[styles.actionItem, isCompleted && styles.actionItemCompleted]}
      onPress={onPress}
    >
      <Text style={styles.actionIcon}>{action.icon}</Text>
      <View style={styles.actionInfo}>
        <Text style={styles.actionName}>{action.name}</Text>
        <Text style={styles.actionDescription}>{action.description}</Text>
      </View>
      <View style={[
        styles.stepUpIndicator,
        action.requiresStepUp ? styles.stepUpRequired : styles.stepUpNotRequired,
      ]}>
        <Text style={styles.stepUpIndicatorText}>
          {action.requiresStepUp ? '🔒' : '✓'}
        </Text>
      </View>
    </Pressable>
  );
}

function Legend() {
  return (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.stepUpRequired]} />
        <Text style={styles.legendText}>Krever step-up</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.stepUpNotRequired]} />
        <Text style={styles.legendText}>Vanlig tilgang</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  explanationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  useCaseText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray700,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
  },
  delegationItem: {
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  delegationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarReceived: {
    backgroundColor: COLORS.success,
  },
  avatarSmallText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.sm,
  },
  delegationInfo: {
    flex: 1,
  },
  delegationName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  delegationRelation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
  },
  accessBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.full,
  },
  accessBadgeFull: {
    backgroundColor: COLORS.successBg,
  },
  accessBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    color: COLORS.success,
  },
  delegationDetails: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  delegationDetailLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    width: 80,
  },
  delegationDetailValue: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray700,
    flex: 1,
  },
  revokeButton: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.dangerBg,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  revokeButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.danger,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  addButton: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  receivedNote: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    marginTop: SPACING.sm,
  },
  switchProfileButton: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  switchProfileButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: '500',
  },
  stepUpExplanation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  actionsList: {
    gap: SPACING.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  actionItemCompleted: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.success,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  actionInfo: {
    flex: 1,
  },
  actionName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  actionDescription: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
  },
  stepUpIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepUpRequired: {
    backgroundColor: COLORS.warningBg,
  },
  stepUpNotRequired: {
    backgroundColor: COLORS.successBg,
  },
  stepUpIndicatorText: {
    fontSize: 14,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
  },
});
