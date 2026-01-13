/**
 * Income to Percentile Mapping Utility
 *
 * Converts dollar amounts to income percentiles using the
 * Health Inequality Project dataset.
 */

import { parseCSV } from './csvParser';
import type { IncomeLifeExpectancyEntry } from '../types';

// @ts-ignore
import csvData from '../data/health_ineq_online_table_1.csv?raw';

interface IncomePercentileMap {
  percentile: number;
  maleIncome: number;
  femaleIncome: number;
}

let incomePercentileCache: IncomePercentileMap[] | null = null;

/**
 * Load and cache income-to-percentile mappings
 */
function getIncomePercentileMap(): IncomePercentileMap[] {
  if (incomePercentileCache !== null) {
    return incomePercentileCache;
  }

  try {
    const parsed = parseCSV<IncomeLifeExpectancyEntry>(csvData);

    // Group by percentile (we have both M and F rows)
    const percentileMap = new Map<number, { maleIncome?: number; femaleIncome?: number }>();

    parsed.forEach(row => {
      if (!percentileMap.has(row.pctile)) {
        percentileMap.set(row.pctile, {});
      }

      const entry = percentileMap.get(row.pctile)!;
      if (row.gnd === 'M') {
        entry.maleIncome = row.hh_inc;
      } else if (row.gnd === 'F') {
        entry.femaleIncome = row.hh_inc;
      }
    });

    // Convert to array
    const result: IncomePercentileMap[] = [];
    percentileMap.forEach((value, percentile) => {
      if (value.maleIncome !== undefined && value.femaleIncome !== undefined) {
        result.push({
          percentile,
          maleIncome: value.maleIncome,
          femaleIncome: value.femaleIncome,
        });
      }
    });

    // Sort by percentile
    result.sort((a, b) => a.percentile - b.percentile);

    incomePercentileCache = result;
    return result;
  } catch (error) {
    console.error('[IncomePercentileMapper] Failed to load data:', error);
    return [];
  }
}

/**
 * Convert dollar amount to income percentile
 *
 * @param income - Annual household income in dollars
 * @param gender - User's gender (affects which income scale to use)
 * @returns Percentile (1-100), or null if invalid
 */
export function getPercentileFromIncome(
  income: number,
  gender: 'male' | 'female' | 'other'
): number | null {
  if (income < 0) return null;

  const map = getIncomePercentileMap();
  if (map.length === 0) return null;

  // For "other", use average of male and female income scales
  const useAverage = gender === 'other';

  // Handle edge cases
  const firstEntry = map[0];
  const lastEntry = map[map.length - 1];

  const firstIncome = useAverage
    ? (firstEntry.maleIncome + firstEntry.femaleIncome) / 2
    : gender === 'female' ? firstEntry.femaleIncome : firstEntry.maleIncome;

  const lastIncome = useAverage
    ? (lastEntry.maleIncome + lastEntry.femaleIncome) / 2
    : gender === 'female' ? lastEntry.femaleIncome : lastEntry.maleIncome;

  if (income <= firstIncome) return 1;
  if (income >= lastIncome) return 100;

  // Find the two percentiles this income falls between
  for (let i = 0; i < map.length - 1; i++) {
    const current = map[i];
    const next = map[i + 1];

    const currentIncome = useAverage
      ? (current.maleIncome + current.femaleIncome) / 2
      : gender === 'female' ? current.femaleIncome : current.maleIncome;

    const nextIncome = useAverage
      ? (next.maleIncome + next.femaleIncome) / 2
      : gender === 'female' ? next.femaleIncome : next.maleIncome;

    if (income >= currentIncome && income <= nextIncome) {
      // Linear interpolation between the two percentiles
      const ratio = (income - currentIncome) / (nextIncome - currentIncome);
      const percentile = current.percentile + ratio * (next.percentile - current.percentile);
      return Math.round(percentile);
    }
  }

  return null;
}

/**
 * Get income amount for a given percentile
 *
 * @param percentile - Income percentile (1-100)
 * @param gender - User's gender
 * @returns Income in dollars, or null if invalid
 */
export function getIncomeFromPercentile(
  percentile: number,
  gender: 'male' | 'female' | 'other'
): number | null {
  if (percentile < 1 || percentile > 100) return null;

  const map = getIncomePercentileMap();
  if (map.length === 0) return null;

  // Find exact match first
  const exactMatch = map.find(entry => entry.percentile === percentile);
  if (exactMatch) {
    if (gender === 'other') {
      return (exactMatch.maleIncome + exactMatch.femaleIncome) / 2;
    }
    return gender === 'female' ? exactMatch.femaleIncome : exactMatch.maleIncome;
  }

  // Find the two entries this percentile falls between
  for (let i = 0; i < map.length - 1; i++) {
    const current = map[i];
    const next = map[i + 1];

    if (percentile >= current.percentile && percentile <= next.percentile) {
      const currentIncome = gender === 'other'
        ? (current.maleIncome + current.femaleIncome) / 2
        : gender === 'female' ? current.femaleIncome : current.maleIncome;

      const nextIncome = gender === 'other'
        ? (next.maleIncome + next.femaleIncome) / 2
        : gender === 'female' ? next.femaleIncome : next.maleIncome;

      // Linear interpolation
      const ratio = (percentile - current.percentile) / (next.percentile - current.percentile);
      return currentIncome + ratio * (nextIncome - currentIncome);
    }
  }

  return null;
}

/**
 * Format income as currency string
 */
export function formatIncome(income: number): string {
  if (income < 1000) {
    return `$${Math.round(income)}`;
  } else if (income < 1000000) {
    return `$${(income / 1000).toFixed(income < 10000 ? 1 : 0)}k`;
  } else {
    return `$${(income / 1000000).toFixed(1)}M`;
  }
}

/**
 * Get income range for display purposes
 * Returns [min, max] income for a percentile
 */
export function getIncomeRange(
  percentile: number,
  gender: 'male' | 'female' | 'other'
): [number, number] | null {
  const map = getIncomePercentileMap();
  if (map.length === 0) return null;

  const entry = map.find(e => e.percentile === percentile);
  if (!entry) return null;

  if (gender === 'other') {
    const avgIncome = (entry.maleIncome + entry.femaleIncome) / 2;
    return [avgIncome * 0.95, avgIncome * 1.05]; // ±5% range
  }

  const income = gender === 'female' ? entry.femaleIncome : entry.maleIncome;
  return [income * 0.95, income * 1.05]; // ±5% range
}
