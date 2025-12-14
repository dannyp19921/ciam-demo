// frontend/src/utils/hash.js
// Hash utility for consistent mock data generation
// Used to generate deterministic values based on user ID
// In production, this would be unnecessary as data comes from backend

/**
 * Simple hash function to generate consistent numbers from a string
 * @param {string} str - Input string (typically user ID)
 * @returns {number} - Positive integer hash value
 */
export function hashCode(str) {
  if (!str) return 0;
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Pick a value from an array based on hash
 * @param {string} seed - Seed for hash
 * @param {Array} array - Array to pick from
 * @param {number} offset - Optional offset for variation
 * @returns {*} - Element from array
 */
export function pickFromArray(seed, array, offset = 0) {
  const hash = hashCode(seed);
  const index = (hash + offset) % array.length;
  return array[index];
}

/**
 * Generate a number within a range based on hash
 * @param {string} seed - Seed for hash
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} offset - Optional offset for variation
 * @returns {number} - Number between min and max
 */
export function hashInRange(seed, min, max, offset = 0) {
  const hash = hashCode(seed);
  return min + ((hash + offset) % (max - min + 1));
}
