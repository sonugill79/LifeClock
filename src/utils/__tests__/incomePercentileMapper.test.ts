/**
 * Unit tests for income percentile mapper
 * Target: 100% code coverage
 */

import { describe, it, expect } from 'vitest';
import {
  getPercentileFromIncome,
  getIncomeFromPercentile,
  formatIncome,
  getIncomeRange,
} from '../incomePercentileMapper';

describe('incomePercentileMapper', () => {
  describe('getPercentileFromIncome', () => {
    it('should return low percentile for very low income', () => {
      const result = getPercentileFromIncome(1000, 'male');

      expect(result).not.toBeNull();
      expect(result).toBeLessThan(10); // Very low income = low percentile
    });

    it('should return 100th percentile for very high income', () => {
      const result = getPercentileFromIncome(2000000, 'female');

      expect(result).toBe(100);
    });

    it('should return percentile for mid-range income', () => {
      const result = getPercentileFromIncome(60000, 'male');

      expect(result).not.toBeNull();
      expect(result).toBeGreaterThan(30);
      expect(result).toBeLessThan(70);
    });

    it('should handle "other" gender by averaging male and female scales', () => {
      const malePercentile = getPercentileFromIncome(50000, 'male');
      const femalePercentile = getPercentileFromIncome(50000, 'female');
      const otherPercentile = getPercentileFromIncome(50000, 'other');

      expect(malePercentile).not.toBeNull();
      expect(femalePercentile).not.toBeNull();
      expect(otherPercentile).not.toBeNull();

      // "Other" should be between male and female
      const min = Math.min(malePercentile!, femalePercentile!);
      const max = Math.max(malePercentile!, femalePercentile!);
      expect(otherPercentile).toBeGreaterThanOrEqual(min);
      expect(otherPercentile).toBeLessThanOrEqual(max);
    });

    it('should return null for negative income', () => {
      const result = getPercentileFromIncome(-1000, 'male');

      expect(result).toBeNull();
    });

    it('should handle zero income', () => {
      const result = getPercentileFromIncome(0, 'female');

      // Zero income should map to 1st percentile (lowest)
      expect(result).toBe(1);
    });

    it('should use linear interpolation between data points', () => {
      // Test that percentile increases smoothly with income
      const income1 = 40000;
      const income2 = 50000;
      const income3 = 60000;

      const p1 = getPercentileFromIncome(income1, 'male');
      const p2 = getPercentileFromIncome(income2, 'male');
      const p3 = getPercentileFromIncome(income3, 'male');

      expect(p1).not.toBeNull();
      expect(p2).not.toBeNull();
      expect(p3).not.toBeNull();

      // Higher income should give higher percentile
      expect(p2!).toBeGreaterThan(p1!);
      expect(p3!).toBeGreaterThan(p2!);
    });

    it('should round percentile to nearest integer', () => {
      const result = getPercentileFromIncome(55000, 'female');

      expect(result).not.toBeNull();
      expect(Number.isInteger(result!)).toBe(true);
    });
  });

  describe('getIncomeFromPercentile', () => {
    it('should return income for 1st percentile', () => {
      const result = getIncomeFromPercentile(1, 'male');

      expect(result).not.toBeNull();
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(20000);
    });

    it('should return income for 50th percentile', () => {
      const result = getIncomeFromPercentile(50, 'female');

      expect(result).not.toBeNull();
      expect(result).toBeGreaterThan(40000);
      expect(result).toBeLessThan(80000);
    });

    it('should return income for 100th percentile', () => {
      const result = getIncomeFromPercentile(100, 'male');

      expect(result).not.toBeNull();
      expect(result).toBeGreaterThan(1000000);
    });

    it('should handle "other" gender by averaging male and female incomes', () => {
      const maleIncome = getIncomeFromPercentile(50, 'male');
      const femaleIncome = getIncomeFromPercentile(50, 'female');
      const otherIncome = getIncomeFromPercentile(50, 'other');

      expect(maleIncome).not.toBeNull();
      expect(femaleIncome).not.toBeNull();
      expect(otherIncome).not.toBeNull();

      const expectedAverage = (maleIncome! + femaleIncome!) / 2;
      expect(otherIncome).toBeCloseTo(expectedAverage, 0);
    });

    it('should return null for invalid percentile (0)', () => {
      const result = getIncomeFromPercentile(0, 'male');

      expect(result).toBeNull();
    });

    it('should return null for invalid percentile (101)', () => {
      const result = getIncomeFromPercentile(101, 'female');

      expect(result).toBeNull();
    });

    it('should use linear interpolation for non-exact percentiles', () => {
      const result = getIncomeFromPercentile(55, 'male');

      expect(result).not.toBeNull();
      expect(result).toBeGreaterThan(0);
    });

    it('should show income increases with percentile', () => {
      const low = getIncomeFromPercentile(10, 'male');
      const mid = getIncomeFromPercentile(50, 'male');
      const high = getIncomeFromPercentile(90, 'male');

      expect(low).not.toBeNull();
      expect(mid).not.toBeNull();
      expect(high).not.toBeNull();

      expect(mid!).toBeGreaterThan(low!);
      expect(high!).toBeGreaterThan(mid!);
    });

    it('should be bidirectional with getPercentileFromIncome', () => {
      // Test round-trip conversion
      const originalPercentile = 75;
      const income = getIncomeFromPercentile(originalPercentile, 'female');
      const backToPercentile = getPercentileFromIncome(income!, 'female');

      expect(income).not.toBeNull();
      expect(backToPercentile).not.toBeNull();

      // Should round-trip correctly (within 1 percentile due to rounding)
      expect(Math.abs(backToPercentile! - originalPercentile)).toBeLessThanOrEqual(1);
    });
  });

  describe('formatIncome', () => {
    it('should format income under $1k without suffix', () => {
      expect(formatIncome(500)).toBe('$500');
      expect(formatIncome(999)).toBe('$999');
    });

    it('should format income in thousands with "k" suffix', () => {
      expect(formatIncome(10000)).toBe('$10k'); // No decimal for >=10k
      expect(formatIncome(57000)).toBe('$57k'); // No decimal for >=10k
      expect(formatIncome(999000)).toBe('$999k'); // No decimal for >=10k
    });

    it('should show decimal for small thousands (< $10k)', () => {
      expect(formatIncome(1000)).toBe('$1.0k'); // One decimal
      expect(formatIncome(1500)).toBe('$1.5k'); // One decimal
      expect(formatIncome(2750)).toBe('$2.8k'); // One decimal, rounded
      expect(formatIncome(5000)).toBe('$5.0k'); // One decimal
      expect(formatIncome(9500)).toBe('$9.5k'); // One decimal
      expect(formatIncome(9876)).toBe('$9.9k'); // One decimal (doesn't round up to $10k)
    });

    it('should format income in millions with "M" suffix', () => {
      expect(formatIncome(1000000)).toBe('$1.0M');
      expect(formatIncome(1500000)).toBe('$1.5M');
      expect(formatIncome(2000000)).toBe('$2.0M');
    });

    it('should handle zero income', () => {
      expect(formatIncome(0)).toBe('$0');
    });

    it('should round to appropriate decimal places', () => {
      expect(formatIncome(57123)).toBe('$57k'); // No decimal for >=$10k
      expect(formatIncome(10001)).toBe('$10k'); // No decimal for >=$10k
      expect(formatIncome(8765)).toBe('$8.8k'); // One decimal for <$10k
      expect(formatIncome(9999)).toBe('$10.0k'); // One decimal for <$10k (doesn't transition to "$10k")
    });
  });

  describe('getIncomeRange', () => {
    it('should return income range for valid percentile (male)', () => {
      const result = getIncomeRange(50, 'male');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);
      expect(result![0]).toBeLessThan(result![1]); // min < max
    });

    it('should return income range for valid percentile (female)', () => {
      const result = getIncomeRange(75, 'female');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);
      expect(result![0]).toBeLessThan(result![1]);
    });

    it('should return income range for "other" gender', () => {
      const result = getIncomeRange(50, 'other');

      expect(result).not.toBeNull();
      expect(result).toHaveLength(2);
      expect(result![0]).toBeLessThan(result![1]);
    });

    it('should return null for invalid percentile', () => {
      const result = getIncomeRange(0, 'male');

      expect(result).toBeNull();
    });

    it('should return range with ~10% spread (±5%)', () => {
      const result = getIncomeRange(50, 'male');

      expect(result).not.toBeNull();

      const [min, max] = result!;
      const midpoint = (min + max) / 2;
      const spread = max - min;
      const percentSpread = (spread / midpoint) * 100;

      // Should be approximately 10% spread (5% on each side)
      expect(percentSpread).toBeCloseTo(10, 1);
    });
  });
});
