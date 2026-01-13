/**
 * Income-based life expectancy calculator
 *
 * Uses Health Inequality Project dataset (Chetty et al., 2016)
 * to provide income-based life expectancy estimates for US users.
 *
 * Key Features:
 * - O(1) lookup using Map cache (Decision #8)
 * - Averages male/female data for "other" gender (Decision #4)
 * - No age restrictions (Decision #5)
 * - Graceful fallback to WHO data on errors (Decision #9)
 *
 * @see /docs/DECISIONS_INCOME_LIFE_EXPECTANCY.md
 */

import { parseCSV } from './csvParser';
import type { IncomeLifeExpectancyEntry, LifeExpectancySource } from '../types';

// Import CSV data as raw text (Vite will handle ?raw suffix)
import csvData from '../data/health_ineq_online_table_1.csv?raw';

// Cache for parsed income data
let cachedIncomeData: Map<string, number> | null = null;
let dataLoadFailed = false;

/**
 * Load and cache income data from CSV
 * Returns Map with key format: "M-50" or "F-50"
 * Returns null if CSV loading fails
 */
function getIncomeDataCache(): Map<string, number> | null {
  // Don't retry if previous load failed
  if (dataLoadFailed) {
    return null;
  }

  // Return cached data if available
  if (cachedIncomeData !== null) {
    return cachedIncomeData;
  }

  try {
    // Parse CSV data
    const parsed = parseCSV<IncomeLifeExpectancyEntry>(csvData);

    // Validate data
    if (parsed.length !== 200) {
      throw new Error(`Expected 200 rows, got ${parsed.length}`);
    }

    // Build Map for O(1) lookups
    const map = new Map<string, number>();
    parsed.forEach(row => {
      const key = `${row.gnd}-${row.pctile}`;
      map.set(key, row.le_agg); // Use le_agg as primary value
    });

    cachedIncomeData = map;
    return map;
  } catch (error) {
    console.error('[IncomeData] CSV load failed:', error);
    dataLoadFailed = true;
    return null; // Fallback to WHO data
  }
}

/**
 * Get life expectancy based on income percentile
 *
 * @param gender - User's gender ('male', 'female', or 'other')
 * @param percentile - Income percentile (1-100, must be integer)
 * @returns Life expectancy in years, or null if lookup fails
 *
 * Special handling:
 * - Gender "other": Returns average of male and female data (Decision #4)
 * - Invalid percentile: Returns null with console warning
 * - CSV load failure: Returns null (triggers fallback to WHO data)
 */
export function getLifeExpectancyByIncome(
  gender: 'male' | 'female' | 'other',
  percentile: number
): number | null {
  // Validate percentile
  if (percentile < 1 || percentile > 100 || !Number.isInteger(percentile)) {
    console.warn(`[IncomeData] Invalid percentile: ${percentile}`);
    return null;
  }

  // Get cached data
  const cache = getIncomeDataCache();
  if (cache === null) {
    return null; // CSV load failed, fall back to WHO data
  }

  // Handle "other" gender: average male and female data (Decision #4)
  if (gender === 'other') {
    const maleKey = `M-${percentile}`;
    const femaleKey = `F-${percentile}`;

    const maleLE = cache.get(maleKey);
    const femaleLE = cache.get(femaleKey);

    if (maleLE === undefined || femaleLE === undefined) {
      console.error(`[IncomeData] No data found for ${gender}, ${percentile}th percentile`);
      return null;
    }

    return (maleLE + femaleLE) / 2;
  }

  // For male/female, standard lookup
  const genderCode = gender === 'female' ? 'F' : 'M';
  const key = `${genderCode}-${percentile}`;
  const result = cache.get(key);

  if (result === undefined) {
    console.error(`[IncomeData] No data found for ${gender}, ${percentile}th percentile`);
    return null;
  }

  return result;
}

/**
 * Get life expectancy data source information
 *
 * @param country - User's country code
 * @param incomePercentile - Optional income percentile (1-100)
 * @returns Source information object
 */
export function getLifeExpectancySource(
  country: string | null,
  incomePercentile?: number
): LifeExpectancySource {
  // Priority 1: US + income percentile → income data
  if (country === 'USA' && incomePercentile !== undefined) {
    return {
      type: 'income',
      dataSource: 'Health Inequality Project',
      description: `US income data (${incomePercentile}th percentile)`,
      details: {
        country,
        incomePercentile,
      },
    };
  }

  // Priority 2: All other cases → WHO country data
  return {
    type: 'country',
    dataSource: 'WHO',
    description: country ? `${country} country data` : 'Global country data',
    details: {
      country: country || undefined,
    },
  };
}
