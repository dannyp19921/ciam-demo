// frontend/src/contexts/ConsentContext.js
// GDPR Consent context
// Responsibility: Manage user consents with AsyncStorage persistence
// GDPR compliance: Article 7 (consent), Article 17 (erasure)

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------------------
// CONSTANTS
// ---------------------
const CONSENT_STORAGE_KEY = 'userConsent';

// Default consent state - all false until user consents
const DEFAULT_CONSENTS = {
  necessary: true,      // Always true - required for functionality
  analytics: false,     // Anonymized usage statistics
  marketing: false,     // Marketing communications
  thirdParty: false,    // Third-party sharing
};

// ---------------------
// CONTEXT DEFINITION
// ---------------------
const ConsentContext = createContext(null);

// ---------------------
// PROVIDER COMPONENT
// ---------------------
export function ConsentProvider({ children }) {
  const [consents, setConsents] = useState(null);
  const [hasConsented, setHasConsented] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------
  // LIFECYCLE
  // ---------------------

  useEffect(() => {
    loadStoredConsents();
  }, []);

  // ---------------------
  // STORAGE FUNCTIONS
  // ---------------------

  /**
   * Load consents from AsyncStorage
   */
  const loadStoredConsents = async () => {
    try {
      const stored = await AsyncStorage.getItem(CONSENT_STORAGE_KEY);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        setConsents(parsed);
        setHasConsented(true);
      }
    } catch (error) {
      console.warn('Failed to load consents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save consents to AsyncStorage
   */
  const saveConsents = async (newConsents) => {
    try {
      await AsyncStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newConsents));
      return true;
    } catch (error) {
      console.error('Failed to save consents:', error);
      return false;
    }
  };

  /**
   * Clear consents from AsyncStorage
   */
  const clearStoredConsents = async () => {
    try {
      await AsyncStorage.removeItem(CONSENT_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear consents:', error);
      return false;
    }
  };

  // ---------------------
  // ACTIONS
  // ---------------------

  /**
   * Set initial consents (from consent screen)
   */
  const acceptConsents = useCallback(async (userConsents) => {
    const consentsToSave = {
      ...DEFAULT_CONSENTS,
      ...userConsents,
      necessary: true,
    };

    const saved = await saveConsents(consentsToSave);
    
    setConsents(consentsToSave);
    setHasConsented(true);

    return saved;
  }, []);

  /**
   * Update a single consent
   */
  const updateConsent = useCallback(async (key, value) => {
    if (key === 'necessary') {
      console.warn('Necessary consents cannot be changed');
      return false;
    }

    const updatedConsents = {
      ...consents,
      [key]: value,
    };

    const saved = await saveConsents(updatedConsents);
    
    if (saved) {
      setConsents(updatedConsents);
    }

    return saved;
  }, [consents]);

  /**
   * Toggle a consent on/off
   */
  const toggleConsent = useCallback(async (key) => {
    if (!consents) return false;
    return updateConsent(key, !consents[key]);
  }, [consents, updateConsent]);

  /**
   * Revoke all consents (GDPR Article 7)
   */
  const revokeAllConsents = useCallback(async () => {
    await clearStoredConsents();
    setConsents(null);
    setHasConsented(false);
  }, []);

  /**
   * Reset consent state (on logout)
   */
  const resetConsentState = useCallback(async () => {
    await clearStoredConsents();
    setConsents(null);
    setHasConsented(false);
  }, []);

  /**
   * Export consent data (GDPR Article 15 - Right to Access)
   */
  const exportConsentData = useCallback(() => {
    if (!consents) return null;

    return {
      consents,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
  }, [consents]);

  /**
   * Check if a specific consent is given
   */
  const hasConsentFor = useCallback((key) => {
    return consents?.[key] ?? false;
  }, [consents]);

  // ---------------------
  // CONTEXT VALUE
  // ---------------------
  const value = {
    consents,
    hasConsented,
    isLoading,
    acceptConsents,
    updateConsent,
    toggleConsent,
    revokeAllConsents,
    resetConsentState,
    exportConsentData,
    hasConsentFor,
  };

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
}

// ---------------------
// CUSTOM HOOK
// ---------------------
export function useConsent() {
  const context = useContext(ConsentContext);

  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }

  return context;
}

export default ConsentContext;
