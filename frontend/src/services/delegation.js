// frontend/src/services/delegation.js
// Delegation (Fullmakt) service
// Responsibility: Generate and handle delegations
// In production: This would fetch data from backend API
// Gjensidige-relevant: Mirrors delegation functionality for family members

import { hashCode } from '../utils/hash';
import { ACCESS_LEVELS } from '../constants/mockData';

// ---------------------
// DELEGATION GENERATION
// ---------------------

/**
 * Generate delegations for a user
 * @param {string} userId - User ID
 * @returns {Object} - { givenTo: [], receivedFrom: [] }
 */
export function generateUserDelegations(userId) {
  if (!userId) return { givenTo: [], receivedFrom: [] };

  const hash = hashCode(userId);

  // Delegations given TO others
  const givenTo = [];
  
  if (hash % 3 === 0) {
    givenTo.push({
      id: 1,
      name: 'Marie Hansen',
      relationship: 'Ektefelle',
      email: 'm.hansen@email.no',
      accessLevel: 'full',
      accessTypes: ['Forsikringer', 'Pensjon'],
      grantedDate: '2024-01-15',
      expiresDate: null,
    });
  }

  if (hash % 5 === 0) {
    givenTo.push({
      id: 2,
      name: 'Erik Olsen',
      relationship: 'Regnskapsfører',
      email: 'erik@regnskap.no',
      accessLevel: 'read',
      accessTypes: ['Forsikringer'],
      grantedDate: '2024-06-01',
      expiresDate: '2025-06-01',
    });
  }

  // Delegations received FROM others
  const receivedFrom = [];

  if (hash % 4 === 0) {
    receivedFrom.push({
      id: 3,
      name: 'Kari Nordmann',
      relationship: 'Mor',
      accessLevel: 'full',
      accessTypes: ['Forsikringer', 'Pensjon'],
      grantedDate: '2023-08-20',
    });
  }

  return { givenTo, receivedFrom };
}

// ---------------------
// ACCESS LEVEL HELPERS
// ---------------------

/**
 * Get description for access level
 * @param {string} level - Access level ID
 * @returns {string} - Description
 */
export function getAccessLevelDescription(level) {
  return ACCESS_LEVELS[level]?.description || level;
}

/**
 * Get name for access level
 * @param {string} level - Access level ID
 * @returns {string} - Name
 */
export function getAccessLevelName(level) {
  return ACCESS_LEVELS[level]?.name || level;
}

/**
 * Check if delegation is expired
 * @param {Object} delegation - Delegation object
 * @returns {boolean} - True if expired
 */
export function isDelegationExpired(delegation) {
  if (!delegation.expiresDate) return false;
  return new Date(delegation.expiresDate) < new Date();
}

/**
 * Filter out expired delegations
 * @param {Array} delegations - List of delegations
 * @returns {Array} - Active delegations
 */
export function filterActiveDelegations(delegations) {
  return delegations.filter(d => !isDelegationExpired(d));
}

// ---------------------
// DELEGATION ACTIONS
// ---------------------

/**
 * Validate new delegation before creation
 * @param {Object} delegation - New delegation data
 * @returns {Object} - { valid: boolean, errors: [] }
 */
export function validateNewDelegation(delegation) {
  const errors = [];

  if (!delegation.name || delegation.name.trim().length < 2) {
    errors.push('Navn må være minst 2 tegn');
  }

  if (!delegation.email || !delegation.email.includes('@')) {
    errors.push('Ugyldig e-postadresse');
  }

  if (!delegation.relationship) {
    errors.push('Relasjon må velges');
  }

  if (!delegation.accessLevel) {
    errors.push('Tilgangsnivå må velges');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export function formatDelegationDate(dateString) {
  if (!dateString) return 'Permanent';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ---------------------
// RELATIONSHIP TYPES
// ---------------------

export const RELATIONSHIP_TYPES = [
  { id: 'spouse', label: 'Ektefelle/Samboer' },
  { id: 'parent', label: 'Forelder' },
  { id: 'child', label: 'Barn (over 18)' },
  { id: 'sibling', label: 'Søsken' },
  { id: 'accountant', label: 'Regnskapsfører' },
  { id: 'lawyer', label: 'Advokat' },
  { id: 'other', label: 'Annet' },
];
