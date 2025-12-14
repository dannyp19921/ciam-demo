// frontend/src/services/insurance.js
// Insurance service
// Responsibility: Generate and handle insurance data
// In production: This would fetch data from backend API

import { hashCode } from '../utils/hash';
import { INSURANCE_TYPES, BUSINESS_INSURANCE_TYPES } from '../constants/mockData';

// ---------------------
// PRIVATE INSURANCES
// ---------------------

/**
 * Generate insurances for private customer
 * @param {string} userId - User ID
 * @returns {Array} - List of insurances
 */
export function generateUserInsurances(userId) {
  if (!userId) return [];

  const hash = hashCode(userId);
  const numInsurances = (hash % 4) + 1;
  const insurances = [];

  for (let i = 0; i < numInsurances; i++) {
    const typeIndex = (hash + i * 7) % INSURANCE_TYPES.length;
    const insuranceType = INSURANCE_TYPES[typeIndex];

    const year = 2024 + (hash % 2);
    const month = ((hash + i) % 12) + 1;
    const policyNum = ((hash * (i + 1)) % 90000) + 10000;

    insurances.push({
      id: i + 1,
      type: insuranceType.type,
      icon: insuranceType.icon,
      policyNumber: `${insuranceType.prefix}-${year}-${policyNum}`,
      status: 'Aktiv',
      validUntil: `${year + 1}-${String(month).padStart(2, '0')}-01`,
      premium: `${((hash + i * 1000) % 5000) + 500} kr/mnd`,
      category: insuranceType.category,
    });
  }

  return insurances;
}

// ---------------------
// BUSINESS INSURANCES
// ---------------------

/**
 * Generate insurances for business customer
 * @param {string} companyId - Company ID
 * @returns {Array} - List of insurances
 */
export function generateBusinessInsurances(companyId) {
  if (!companyId) return [];

  const hash = hashCode(companyId);
  const numInsurances = (hash % 4) + 2;
  const insurances = [];

  for (let i = 0; i < numInsurances; i++) {
    const typeIndex = (hash + i * 5) % BUSINESS_INSURANCE_TYPES.length;
    const insuranceType = BUSINESS_INSURANCE_TYPES[typeIndex];

    const year = 2024;
    const month = ((hash + i) % 12) + 1;
    const policyNum = ((hash * (i + 1)) % 90000) + 10000;

    insurances.push({
      id: i + 1,
      type: insuranceType.type,
      icon: insuranceType.icon,
      policyNumber: `${insuranceType.prefix}-${year}-${policyNum}`,
      status: 'Aktiv',
      validUntil: `${year + 1}-${String(month).padStart(2, '0')}-01`,
      premium: `${((hash + i * 2000) % 15000) + 2000} kr/mnd`,
      category: insuranceType.category,
    });
  }

  return insurances;
}

// ---------------------
// FILTERING AND UTILITIES
// ---------------------

/**
 * Filter insurances based on RBAC permissions
 * @param {Array} insurances - List of insurances
 * @param {Array} permissions - Permissions (e.g., ['ting', 'person'])
 * @returns {Array} - Filtered insurances
 */
export function filterInsurancesByPermissions(insurances, permissions) {
  if (!insurances || !permissions) return [];
  return insurances.filter(ins => permissions.includes(ins.category));
}

/**
 * Group insurances by category
 * @param {Array} insurances - List of insurances
 * @returns {Object} - Grouped insurances { ting: [], person: [] }
 */
export function groupInsurancesByCategory(insurances) {
  if (!insurances) return {};

  return insurances.reduce((groups, insurance) => {
    const category = insurance.category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(insurance);
    return groups;
  }, {});
}

/**
 * Calculate total annual premium
 * @param {Array} insurances - List of insurances
 * @returns {number} - Total annual premium
 */
export function calculateTotalAnnualPremium(insurances) {
  if (!insurances) return 0;

  return insurances.reduce((total, insurance) => {
    const monthlyMatch = insurance.premium.match(/(\d+)\s*kr\/mnd/);
    if (monthlyMatch) {
      return total + (parseInt(monthlyMatch[1], 10) * 12);
    }
    return total;
  }, 0);
}

/**
 * Get status badge info
 * @param {string} status - Insurance status
 * @returns {Object} - { color, label }
 */
export function getStatusBadge(status) {
  const statusMap = {
    'Aktiv': { color: 'success', label: 'Aktiv' },
    'Utløpt': { color: 'danger', label: 'Utløpt' },
    'Venter': { color: 'warning', label: 'Venter' },
    'Kansellert': { color: 'gray', label: 'Kansellert' },
  };

  return statusMap[status] || { color: 'gray', label: status };
}
