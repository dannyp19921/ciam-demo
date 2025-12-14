// frontend/src/services/business.js
// Business service
// Responsibility: Generate company profiles and handle RBAC
// Gjensidige-relevant: Roles for business customers (CEO, HR, etc.)

import { hashCode } from '../utils/hash';
import { 
  COMPANY_NAMES, 
  BUSINESS_ROLES, 
  STREET_NAMES, 
  CITIES 
} from '../constants/mockData';

// ---------------------
// COMPANY PROFILE
// ---------------------

/**
 * Generate company profile based on user ID
 * @param {string} userId - User ID
 * @returns {Object|null} - Company profile
 */
export function generateCompanyProfile(userId) {
  if (!userId) return null;

  const hash = hashCode(userId);
  const companyIndex = hash % COMPANY_NAMES.length;
  const roleIndex = hash % BUSINESS_ROLES.length;
  const cityIndex = hash % CITIES.length;

  return {
    companyName: COMPANY_NAMES[companyIndex],
    orgNumber: formatOrgNumber(900000000 + (hash % 100000000)),
    role: BUSINESS_ROLES[roleIndex],
    address: {
      street: `${STREET_NAMES[hash % STREET_NAMES.length]} ${(hash % 50) + 1}`,
      postalCode: CITIES[cityIndex].postalCode,
      city: CITIES[cityIndex].city,
    },
    employeeCount: (hash % 200) + 10,
    customerSince: `${2010 + (hash % 14)}`,
  };
}

/**
 * Format organization number with spaces
 * @param {number|string} orgNumber - Org number
 * @returns {string} - Formatted org number (xxx xxx xxx)
 */
export function formatOrgNumber(orgNumber) {
  const str = String(orgNumber);
  return `${str.slice(0, 3)} ${str.slice(3, 6)} ${str.slice(6)}`;
}

// ---------------------
// RBAC (Role-Based Access Control)
// ---------------------

/**
 * Check if a role has a specific permission
 * @param {Object} role - Role object
 * @param {string} permissionType - Permission type ('ting', 'person', 'pensjon')
 * @returns {boolean} - Has permission
 */
export function hasPermission(role, permissionType) {
  if (!role || !role.permissions) return false;
  return role.permissions.includes(permissionType);
}

/**
 * Check if a role has all specified permissions
 * @param {Object} role - Role object
 * @param {Array} permissionTypes - List of permission types
 * @returns {boolean} - Has all permissions
 */
export function hasAllPermissions(role, permissionTypes) {
  if (!role || !role.permissions) return false;
  return permissionTypes.every(p => role.permissions.includes(p));
}

/**
 * Check if a role has at least one of the permissions
 * @param {Object} role - Role object
 * @param {Array} permissionTypes - List of permission types
 * @returns {boolean} - Has at least one permission
 */
export function hasAnyPermission(role, permissionTypes) {
  if (!role || !role.permissions) return false;
  return permissionTypes.some(p => role.permissions.includes(p));
}

/**
 * Get all available roles
 * @returns {Array} - List of roles
 */
export function getBusinessRoles() {
  return BUSINESS_ROLES;
}

/**
 * Get role by ID
 * @param {string} roleId - Role ID
 * @returns {Object|undefined} - Role object
 */
export function getRoleById(roleId) {
  return BUSINESS_ROLES.find(r => r.id === roleId);
}

/**
 * Get access description for a role
 * @param {Object} role - Role object
 * @returns {string} - Human-readable description of access
 */
export function getRoleAccessDescription(role) {
  if (!role) return '';
  
  const permissionLabels = {
    ting: 'Tingforsikringer',
    person: 'Personforsikringer',
    pensjon: 'Pensjon',
  };

  const accessList = role.permissions
    .map(p => permissionLabels[p])
    .filter(Boolean);

  return accessList.join(', ');
}

// ---------------------
// PERMISSION CATEGORIES
// ---------------------

export const PERMISSION_CATEGORIES = {
  ting: {
    id: 'ting',
    label: 'Tingforsikringer',
    description: 'Forsikringer for eiendeler (bil, hus, båt, etc.)',
    icon: '🏠',
  },
  person: {
    id: 'person',
    label: 'Personforsikringer',
    description: 'Forsikringer for ansatte (yrkesskade, helse, etc.)',
    icon: '👤',
  },
  pensjon: {
    id: 'pensjon',
    label: 'Pensjon',
    description: 'Pensjonsordninger og -avtaler',
    icon: '💰',
  },
};

/**
 * Get category info by ID
 * @param {string} categoryId - Category ID
 * @returns {Object|undefined} - Category object
 */
export function getPermissionCategory(categoryId) {
  return PERMISSION_CATEGORIES[categoryId];
}
