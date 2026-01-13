import { useMemo } from 'react';
import { getLifeExpectancyWithFallback } from '../utils/lifeExpectancyCalculator';
import {
  getLifeExpectancyByIncome,
  getLifeExpectancySource,
} from '../utils/incomeLifeExpectancyCalculator';
import type { LifeExpectancySource } from '../types';

/**
 * Custom hook to get life expectancy for a country and gender
 *
 * Priority logic (Decision #9 - Graceful fallback):
 * 1. If US + income percentile → Use income-based data
 * 2. If income lookup fails → Fall back to WHO country data
 * 3. For all other cases → Use WHO country data
 *
 * @param country - ISO 3166-1 alpha-3 country code (or 2-letter like "US")
 * @param gender - 'male', 'female', or 'other'
 * @param incomePercentile - Optional income percentile (1-100, US only)
 * @returns Object with life expectancy and data source information
 */
export function useLifeExpectancy(
  country: string | null,
  gender: 'male' | 'female' | 'other' | null,
  incomePercentile?: number
): {
  lifeExpectancy: number | null;
  source: LifeExpectancySource | null;
} {
  return useMemo(() => {
    if (!country || !gender) {
      return { lifeExpectancy: null, source: null };
    }

    // Priority 1: US + Income Percentile → Try income data
    if (country === 'US' && incomePercentile !== undefined) {
      try {
        const incomeLE = getLifeExpectancyByIncome(gender, incomePercentile);

        if (incomeLE !== null) {
          return {
            lifeExpectancy: incomeLE,
            source: getLifeExpectancySource(country, incomePercentile),
          };
        }

        // Income lookup returned null, fall back to WHO data
        console.warn('[useLifeExpectancy] Income lookup failed, using WHO data');
      } catch (error) {
        console.error('[useLifeExpectancy] Income calculation error:', error);
        // Fall through to WHO data
      }
    }

    // Priority 2: Fallback to WHO country data
    const countryLE = getLifeExpectancyWithFallback(country, gender);
    return {
      lifeExpectancy: countryLE,
      source: getLifeExpectancySource(country, undefined),
    };
  }, [country, gender, incomePercentile]);
}
