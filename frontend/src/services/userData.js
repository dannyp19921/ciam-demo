// frontend/src/services/userData.js
// User data aggregator
// This file re-exports from specialized modules for backwards compatibility
// New imports should use the specific modules directly

// Re-export from profile.js
export { 
  getFirstName,
  generateUserProfile, 
  getUserDisplayInfo,
  formatAddress,
} from './profile';

// Re-export from insurance.js
export { 
  generateUserInsurances,
  generateBusinessInsurances,
  filterInsurancesByPermissions,
  groupInsurancesByCategory,
  calculateTotalAnnualPremium,
  getStatusBadge,
} from './insurance';

// Re-export from delegation.js
export { 
  generateUserDelegations, 
  getAccessLevelDescription,
  getAccessLevelName,
  isDelegationExpired,
  filterActiveDelegations,
  validateNewDelegation,
  formatDelegationDate,
  RELATIONSHIP_TYPES,
} from './delegation';

// Re-export from business.js
export { 
  generateCompanyProfile,
  formatOrgNumber,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getBusinessRoles,
  getRoleById,
  getRoleAccessDescription,
  PERMISSION_CATEGORIES,
  getPermissionCategory,
} from './business';

// Re-export constants
export { SENSITIVE_ACTIONS } from '../constants/mockData';

// ---------------------
// PROFILE SWITCHING
// ---------------------
// This function uses data from multiple modules and remains here

import { hashCode } from '../utils/hash';
import { generateUserProfile } from './profile';
import { generateUserDelegations } from './delegation';
import { generateCompanyProfile } from './business';
import { COMPANY_NAMES, BUSINESS_ROLES } from '../constants/mockData';

/**
 * Get available profiles for profile switching
 * Includes own profile + delegated profiles
 * @param {string} userId - User ID
 * @param {string} customerType - 'private' or 'business'
 * @returns {Array} - List of profiles
 */
export function getAvailableProfiles(userId, customerType) {
  if (!userId) return [];

  const hash = hashCode(userId);
  const profiles = [];

  // Always add own profile first
  const userProfile = generateUserProfile({ sub: userId, email: 'user@example.com' });
  
  profiles.push({
    id: 'self',
    type: 'self',
    name: customerType === 'business' 
      ? generateCompanyProfile(userId).companyName 
      : userProfile.fullName,
    subtitle: customerType === 'business' ? 'Din bedrift' : 'Din profil',
    icon: customerType === 'business' ? '🏢' : '👤',
  });

  if (customerType === 'private') {
    // Add family members from delegations
    const delegations = generateUserDelegations(userId);
    
    delegations.receivedFrom.forEach(d => {
      profiles.push({
        id: `delegate-${d.id}`,
        type: 'delegation',
        name: d.name,
        subtitle: `Fullmakt fra ${d.relationship.toLowerCase()}`,
        icon: '👵',
        delegationInfo: d,
      });
    });
  } else {
    // Add other companies user has access to
    if (hash % 3 === 0) {
      profiles.push({
        id: 'company-2',
        type: 'business',
        name: COMPANY_NAMES[(hash + 2) % COMPANY_NAMES.length],
        subtitle: 'Regnskapsfører-tilgang',
        icon: '🏢',
        role: BUSINESS_ROLES[2],
      });
    }
  }

  return profiles;
}
