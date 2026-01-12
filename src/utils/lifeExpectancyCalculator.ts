import lifeExpectancyData from '../data/lifeExpectancy.json';
import type { LifeExpectancyData } from '../types';

// Type assertion for imported JSON
const data: LifeExpectancyData = lifeExpectancyData as LifeExpectancyData;

/**
 * Get life expectancy for a specific country and gender
 * @param country - ISO 3166-1 alpha-3 country code (e.g., "USA", "GBR", "JPN")
 * @param gender - 'male', 'female', or 'other'
 * @returns Life expectancy in years, or null if not found
 */
export function getLifeExpectancy(
  country: string,
  gender: 'male' | 'female' | 'other'
): number | null {
  const countryData = data[country];

  if (!countryData) {
    return null;
  }

  // For 'other', use the combined average ('both')
  if (gender === 'other') {
    return countryData.both;
  }

  return countryData[gender];
}

/**
 * Get life expectancy with fallback to global average
 * @param country - ISO 3166-1 alpha-3 country code
 * @param gender - 'male', 'female', or 'other'
 * @returns Life expectancy in years (73 if country not found)
 */
export function getLifeExpectancyWithFallback(
  country: string,
  gender: 'male' | 'female' | 'other'
): number {
  const lifeExpectancy = getLifeExpectancy(country, gender);

  // Global average fallback
  return lifeExpectancy ?? 73;
}

/**
 * Get sorted list of all countries for dropdown
 * @returns Array of {code, name} objects sorted alphabetically by name
 */
export function getCountryList(): Array<{ code: string; name: string }> {
  const countries = Object.entries(data).map(([code, entry]) => ({
    code,
    name: entry.countryName,
  }));

  // Sort alphabetically by country name
  return countries.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get country name from code
 * @param code - ISO 3166-1 alpha-3 country code
 * @returns Country name or null if not found
 */
export function getCountryName(code: string): string | null {
  return data[code]?.countryName ?? null;
}

/**
 * Check if a country code exists in the dataset
 * @param code - ISO 3166-1 alpha-3 country code
 * @returns true if country exists
 */
export function isValidCountryCode(code: string): boolean {
  return code in data;
}

/**
 * Get statistics about the life expectancy data
 * @returns Object with count, highest, lowest life expectancy
 */
export function getDataStatistics() {
  const allExpectancies = Object.values(data).map(entry => entry.both);

  return {
    totalCountries: Object.keys(data).length,
    highestExpectancy: Math.max(...allExpectancies),
    lowestExpectancy: Math.min(...allExpectancies),
    averageExpectancy: allExpectancies.reduce((a, b) => a + b, 0) / allExpectancies.length,
  };
}
