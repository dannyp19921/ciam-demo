// frontend/src/contexts/UserContext.js
// User context for profiles and customer type
// Responsibility: Customer type selection, profile switching, active profile state
// Separated from auth for better separation of concerns

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getAvailableProfiles } from '../services/userData';

// ---------------------
// TYPES
// ---------------------
export const CUSTOMER_TYPES = {
  PRIVATE: 'private',
  BUSINESS: 'business',
};

// ---------------------
// CONTEXT DEFINITION
// ---------------------
const UserContext = createContext(null);

// ---------------------
// PROVIDER COMPONENT
// ---------------------
export function UserProvider({ children, userId }) {
  // Customer type selected before login
  const [customerType, setCustomerType] = useState(null);
  
  // Active profile (own or delegated)
  const [activeProfile, setActiveProfile] = useState(null);
  
  // Profile switcher visibility
  const [isProfileSwitcherVisible, setIsProfileSwitcherVisible] = useState(false);

  // ---------------------
  // COMPUTED VALUES
  // ---------------------

  /**
   * Get available profiles based on userId and customerType
   */
  const availableProfiles = useMemo(() => {
    if (!userId || !customerType) return [];
    return getAvailableProfiles(userId, customerType);
  }, [userId, customerType]);

  /**
   * Check if user is viewing a delegated profile
   */
  const isViewingDelegatedProfile = useMemo(() => {
    return activeProfile?.type === 'delegation';
  }, [activeProfile]);

  const hasSelectedCustomerType = Boolean(customerType);

  // ---------------------
  // ACTIONS
  // ---------------------

  /**
   * Set customer type (private/business)
   */
  const selectCustomerType = useCallback((type) => {
    if (type !== CUSTOMER_TYPES.PRIVATE && type !== CUSTOMER_TYPES.BUSINESS) {
      console.warn('Invalid customer type:', type);
      return;
    }
    setCustomerType(type);
  }, []);

  /**
   * Initialize default profile when user logs in
   */
  const initializeDefaultProfile = useCallback((userId, type) => {
    if (!userId || !type) return;
    
    const profiles = getAvailableProfiles(userId, type);
    if (profiles.length > 0) {
      setActiveProfile(profiles[0]);
    }
  }, []);

  /**
   * Switch to a different profile
   */
  const switchProfile = useCallback((profile) => {
    setActiveProfile(profile);
    setIsProfileSwitcherVisible(false);
  }, []);

  /**
   * Open profile switcher modal
   */
  const openProfileSwitcher = useCallback(() => {
    setIsProfileSwitcherVisible(true);
  }, []);

  /**
   * Close profile switcher modal
   */
  const closeProfileSwitcher = useCallback(() => {
    setIsProfileSwitcherVisible(false);
  }, []);

  /**
   * Reset all user state (on logout)
   */
  const resetUserState = useCallback(() => {
    setCustomerType(null);
    setActiveProfile(null);
    setIsProfileSwitcherVisible(false);
  }, []);

  // ---------------------
  // CONTEXT VALUE
  // ---------------------
  const value = {
    // State
    customerType,
    activeProfile,
    availableProfiles,
    isProfileSwitcherVisible,
    
    // Computed
    hasSelectedCustomerType,
    isViewingDelegatedProfile,
    isPrivateCustomer: customerType === CUSTOMER_TYPES.PRIVATE,
    isBusinessCustomer: customerType === CUSTOMER_TYPES.BUSINESS,
    
    // Actions
    selectCustomerType,
    initializeDefaultProfile,
    switchProfile,
    openProfileSwitcher,
    closeProfileSwitcher,
    resetUserState,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// ---------------------
// CUSTOM HOOK
// ---------------------
export function useUser() {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
}

export default UserContext;
