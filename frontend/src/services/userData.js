// src/services/userData.js

// Generate consistent mock data based on user ID
// In production, this would come from your backend database

const INSURANCE_TYPES = [
  { type: 'Bilforsikring', icon: '🚗', prefix: 'BIL' },
  { type: 'Innboforsikring', icon: '🏠', prefix: 'INN' },
  { type: 'Reiseforsikring', icon: '✈️', prefix: 'REI' },
  { type: 'Husforsikring', icon: '🏡', prefix: 'HUS' },
  { type: 'Livsforsikring', icon: '❤️', prefix: 'LIV' },
  { type: 'Båtforsikring', icon: '⛵', prefix: 'BAT' },
  { type: 'Dyreforsikring', icon: '🐕', prefix: 'DYR' },
];

const STREET_NAMES = [
  'Storgata', 'Kirkegata', 'Parkveien', 'Solveien', 
  'Fjordgata', 'Bjørkealléen', 'Granveien', 'Osloveien'
];

const CITIES = [
  { city: 'Oslo', postalCode: '0150' },
  { city: 'Bergen', postalCode: '5003' },
  { city: 'Trondheim', postalCode: '7010' },
  { city: 'Stavanger', postalCode: '4006' },
  { city: 'Drammen', postalCode: '3015' },
  { city: 'Kristiansand', postalCode: '4612' },
];

// Simple hash function to generate consistent numbers from a string
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Generate insurances based on user's unique ID
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
    });
  }
  
  return insurances;
}

// Extract first name from full name or email
export function getFirstName(user) {
  if (!user) return 'bruker';
  
  if (user.name && !user.name.includes('@')) {
    return user.name.split(' ')[0];
  }
  
  if (user.given_name) {
    return user.given_name;
  }
  
  if (user.email) {
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }
  
  return 'bruker';
}

// Generate user profile data based on user ID
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
  
  return {
    // Personal info
    firstName: getFirstName(user),
    lastName: generateLastName(hash),
    fullName: user.name || `${getFirstName(user)} ${generateLastName(hash)}`,
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
    customerNumber: customerNumber,
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

function generateLastName(hash) {
  const lastNames = [
    'Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen',
    'Pedersen', 'Nilsen', 'Kristiansen', 'Jensen', 'Karlsen',
    'Johnsen', 'Pettersen', 'Eriksen', 'Berg', 'Haugen'
  ];
  return lastNames[hash % lastNames.length];
}

// Get user display info (simplified version)
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