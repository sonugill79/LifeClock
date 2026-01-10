import { useMemo } from 'react';
import { getLifeExpectancyWithFallback } from '../utils/lifeExpectancyCalculator';

/**
 * Custom hook to get life expectancy for a country and gender
 * @param country - ISO 3166-1 alpha-3 country code
 * @param gender - 'male' or 'female'
 * @returns Life expectancy in years, or null if inputs are null
 */
export function useLifeExpectancy(
  country: string | null,
  gender: 'male' | 'female' | null
): number | null {
  return useMemo(() => {
    if (!country || !gender) {
      return null;
    }

    return getLifeExpectancyWithFallback(country, gender);
  }, [country, gender]);
}
