// frontend/src/constants/mockData.js
// Constants for mock data generation
// Centralized location for all mock data arrays
// Makes it easy to modify and extend demo data

// ---------------------
// GEOGRAPHIC DATA
// ---------------------
export const STREET_NAMES = [
  'Storgata',
  'Kirkegata',
  'Parkveien',
  'Solveien',
  'Fjordgata',
  'Bjørkealléen',
  'Granveien',
  'Osloveien',
];

export const CITIES = [
  { city: 'Oslo', postalCode: '0150' },
  { city: 'Bergen', postalCode: '5003' },
  { city: 'Trondheim', postalCode: '7010' },
  { city: 'Stavanger', postalCode: '4006' },
  { city: 'Drammen', postalCode: '3015' },
  { city: 'Kristiansand', postalCode: '4612' },
];

export const LAST_NAMES = [
  'Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen',
  'Pedersen', 'Nilsen', 'Kristiansen', 'Jensen', 'Karlsen',
  'Johnsen', 'Pettersen', 'Eriksen', 'Berg', 'Haugen',
];

// ---------------------
// INSURANCE TYPES
// ---------------------
export const INSURANCE_TYPES = [
  { type: 'Bilforsikring', icon: '🚗', prefix: 'BIL', category: 'ting' },
  { type: 'Innboforsikring', icon: '🏠', prefix: 'INN', category: 'ting' },
  { type: 'Reiseforsikring', icon: '✈️', prefix: 'REI', category: 'person' },
  { type: 'Husforsikring', icon: '🏡', prefix: 'HUS', category: 'ting' },
  { type: 'Livsforsikring', icon: '❤️', prefix: 'LIV', category: 'person' },
  { type: 'Båtforsikring', icon: '⛵', prefix: 'BAT', category: 'ting' },
  { type: 'Dyreforsikring', icon: '🐕', prefix: 'DYR', category: 'person' },
];

export const BUSINESS_INSURANCE_TYPES = [
  { type: 'Næringsforsikring', icon: '🏢', prefix: 'NÆR', category: 'ting' },
  { type: 'Ansvarsforsikring', icon: '⚖️', prefix: 'ANS', category: 'ting' },
  { type: 'Yrkesskadeforsikring', icon: '🦺', prefix: 'YRK', category: 'person' },
  { type: 'Bedriftsbil', icon: '🚐', prefix: 'BIL', category: 'ting' },
  { type: 'Kontorforsikring', icon: '🖥️', prefix: 'KNT', category: 'ting' },
  { type: 'Driftstapsforsikring', icon: '📉', prefix: 'DRF', category: 'ting' },
];

// ---------------------
// COMPANY DATA
// ---------------------
export const COMPANY_NAMES = [
  'Nordvik AS',
  'Fjordtech Solutions',
  'Bergen Bygg AS',
  'Oslo Consulting Group',
  'Trondheim Transport',
  'Stavanger Shipping',
];

// ---------------------
// RBAC ROLES
// ---------------------
export const BUSINESS_ROLES = [
  {
    id: 'daglig_leder',
    name: 'Daglig leder',
    permissions: ['ting', 'person', 'pensjon'],
    description: 'Full tilgang til alle forsikringer og pensjon',
  },
  {
    id: 'hr_ansvarlig',
    name: 'HR-ansvarlig',
    permissions: ['person', 'pensjon'],
    description: 'Tilgang til personforsikringer og pensjon',
  },
  {
    id: 'regnskapsforer',
    name: 'Regnskapsfører',
    permissions: ['ting'],
    description: 'Kun tilgang til tingforsikringer',
  },
  {
    id: 'okonomisjef',
    name: 'Økonomisjef',
    permissions: ['ting', 'pensjon'],
    description: 'Tilgang til tingforsikringer og pensjon',
  },
];

// ---------------------
// SENSITIVE ACTIONS (Step-up authentication)
// ---------------------
export const SENSITIVE_ACTIONS = [
  {
    id: 'change_contact',
    name: 'Endre kontaktinformasjon',
    icon: '📝',
    description: 'Endre e-post, telefon eller adresse',
    requiresStepUp: true,
  },
  {
    id: 'sign_agreement',
    name: 'Signere avtale',
    icon: '✍️',
    description: 'Signere nye forsikringsavtaler',
    requiresStepUp: true,
  },
  {
    id: 'add_delegation',
    name: 'Gi fullmakt',
    icon: '🤝',
    description: 'Gi andre tilgang til dine forsikringer',
    requiresStepUp: true,
  },
  {
    id: 'cancel_insurance',
    name: 'Si opp forsikring',
    icon: '❌',
    description: 'Avslutte en forsikringsavtale',
    requiresStepUp: true,
  },
  {
    id: 'view_policy',
    name: 'Se forsikringsdetaljer',
    icon: '👁️',
    description: 'Lese forsikringsinformasjon',
    requiresStepUp: false,
  },
  {
    id: 'report_claim',
    name: 'Melde skade',
    icon: '📋',
    description: 'Registrere en skademelding',
    requiresStepUp: false,
  },
];

// ---------------------
// ACCESS LEVELS
// ---------------------
export const ACCESS_LEVELS = {
  full: {
    id: 'full',
    name: 'Full tilgang',
    description: 'Full tilgang (lese og endre)',
  },
  read: {
    id: 'read',
    name: 'Lesetilgang',
    description: 'Kun lesetilgang',
  },
  limited: {
    id: 'limited',
    name: 'Begrenset tilgang',
    description: 'Begrenset tilgang',
  },
};
