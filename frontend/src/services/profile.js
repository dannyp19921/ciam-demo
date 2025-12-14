// frontend/src/services/profile.js
// User profile service
// Responsibility: Generate and handle user profiles
// In production: This would fetch data from backend API

import { hashCode } from '../utils/hash';
import { STREET_NAMES, CITIES, LAST_NAMES } from '../constants/mockData';

// ---------------------
// PROFILE GENERATION
// ---------------------

/**
 * Extract first name from user data
 * @param {Object} user - Auth0 user object
 * @returns {string} - First name
 */
export function getFirstName(user) {
  if (!user) return 'bruker';

  // Try name field first (if not email)
  if (user.name && !user.name.includes('@')) {
    return user.name.split(' ')[0];
  }

  // Try given_name from OIDC claims
  if (user.given_name) {
    return user.given_name;
  }

  // Fall back to email prefix
  if (user.email) {
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }

  return 'bruker';
}

/**
 * Generate last name based on hash
 * @param {number} hash - Hash value
 * @returns {string} - Last name
 */
function generateLastName(hash) {
  return LAST_NAMES[hash % LAST_NAMES.length];
}

/**
 * Generate complete user profile based on Auth0 data
 * @param {Object} user - Auth0 user object
 * @returns {Object|null} - User profile or null
 */
export function generateUserProfile(user) {
  if (!user) return null;

  const hash = hashCode(user.sub || user.email || 'default');

  // Generate consistent birthdate (age 25-65)
  const birthYear = 1960 + (hash % 40);
  const birthMonth = (hash % 12) + 1;
  const birthDay = (hash % 28) + 1;

  // Generate phone number
  const phoneNumber = `+47 ${400 + (hash % 100)} ${(hash % 90) + 10} ${(hash * 3 % 90) + 10}${(hash * 7 % 10)}`;

  // Generate address
  const streetIndex = hash % STREET_NAMES.length;
  const streetNumber = (hash % 150) + 1;
  const cityIndex = (hash * 3) % CITIES.length;
  const cityData = CITIES[cityIndex];

  // Customer number and registration date
  const customerNumber = `KNR-${1000000 + (hash % 9000000)}`;
  const memberSinceYear = 2015 + (hash % 10);

  const lastName = generateLastName(hash);
  const firstName = getFirstName(user);

  return {
    // Personal info
    firstName,
    lastName,
    fullName: user.name || `${firstName} ${lastName}`,
    birthDate: `${birthDay.toString().padStart(2, '0')}.${birthMonth.toString().padStart(2, '0')}.${birthYear}`,

    // Contact info
    email: user.email,
    phone: phoneNumber,

    // Address
    address: {
      street: `${STREET_NAMES[streetIndex]} ${streetNumber}`,
      postalCode: cityData.postalCode,
      city: cityData.city,
      country: 'Norge',
    },

    // Customer info
    customerNumber,
    memberSince: `${memberSinceYear}`,
    customerType: hash % 3 === 0 ? 'Premium' : 'Standard',

    // Account info
    emailVerified: user.email_verified || false,
    picture: user.picture || null,
    userId: user.sub,

    // Preferences
    communicationPreferences: {
      email: true,
      sms: hash % 2 === 0,
      post: hash % 4 === 0,
    },
  };
}

/**
 * Get simplified display info for user
 * @param {Object} user - Auth0 user object
 * @returns {Object|null} - Simplified user info
 */
export function getUserDisplayInfo(user) {
  if (!user) return null;

  const profile = generateUserProfile(user);

  return {
    firstName: profile.firstName,
    fullName: profile.fullName,
    email: user.email,
    emailVerified: user.email_verified || false,
    picture: user.picture || null,
    userId: user.sub,
    createdAt: user.updated_at || new Date().toISOString(),
  };
}

/**
 * Format address to single line
 * @param {Object} address - Address object
 * @returns {string} - Formatted address
 */
export function formatAddress(address) {
  if (!address) return '';
  return `${address.street}, ${address.postalCode} ${address.city}`;
}
