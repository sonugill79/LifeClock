/**
 * Unit tests for income-based life expectancy calculator
 * Target: 100% code coverage
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getLifeExpectancyByIncome,
  getLifeExpectancySource,
} from '../incomeLifeExpectancyCalculator';

describe('incomeLifeExpectancyCalculator', () => {
  describe('getLifeExpectancyByIncome', () => {
    it('should return correct life expectancy for female at 50th percentile', () => {
      const result = getLifeExpectancyByIncome('female', 50);

      expect(result).not.toBeNull();
      expect(result).toBeCloseTo(84.98, 2); // Within 0.01
    });

    it('should return correct life expectancy for male at 1st percentile', () => {
      const result = getLifeExpectancyByIncome('male', 1);

      expect(result).not.toBeNull();
      // Check that it's a reasonable value (dataset specific)
      expect(result).toBeGreaterThan(70);
      expect(result).toBeLessThan(75);
    });

    it('should return correct life expectancy for female at 100th percentile', () => {
      const result = getLifeExpectancyByIncome('female', 100);

      expect(result).not.toBeNull();
      // Check that it's a reasonable value (dataset specific)
      expect(result).toBeGreaterThan(88);
      expect(result).toBeLessThan(90);
    });

    it('should return average of male and female for "other" gender', () => {
      const maleResult = getLifeExpectancyByIncome('male', 50);
      const femaleResult = getLifeExpectancyByIncome('female', 50);
      const otherResult = getLifeExpectancyByIncome('other', 50);

      expect(maleResult).not.toBeNull();
      expect(femaleResult).not.toBeNull();
      expect(otherResult).not.toBeNull();

      const expectedAverage = (maleResult! + femaleResult!) / 2;
      expect(otherResult).toBeCloseTo(expectedAverage, 2);
    });

    it('should return null for invalid percentile (0)', () => {
      const result = getLifeExpectancyByIncome('male', 0);

      expect(result).toBeNull();
    });

    it('should return null for invalid percentile (101)', () => {
      const result = getLifeExpectancyByIncome('female', 101);

      expect(result).toBeNull();
    });

    it('should return null for non-integer percentile', () => {
      const result = getLifeExpectancyByIncome('male', 50.5);

      expect(result).toBeNull();
    });

    it('should handle all valid percentiles (1-100) for male', () => {
      for (let percentile = 1; percentile <= 100; percentile++) {
        const result = getLifeExpectancyByIncome('male', percentile);

        expect(result).not.toBeNull();
        expect(result).toBeGreaterThan(70); // Reasonable lower bound
        expect(result).toBeLessThan(92); // Reasonable upper bound
      }
    });

    it('should handle all valid percentiles (1-100) for female', () => {
      for (let percentile = 1; percentile <= 100; percentile++) {
        const result = getLifeExpectancyByIncome('female', percentile);

        expect(result).not.toBeNull();
        expect(result).toBeGreaterThan(75); // Reasonable lower bound
        expect(result).toBeLessThan(92); // Reasonable upper bound
      }
    });

    it('should show life expectancy increases with income percentile', () => {
      const lowIncome = getLifeExpectancyByIncome('male', 10);
      const midIncome = getLifeExpectancyByIncome('male', 50);
      const highIncome = getLifeExpectancyByIncome('male', 90);

      expect(lowIncome).not.toBeNull();
      expect(midIncome).not.toBeNull();
      expect(highIncome).not.toBeNull();

      // Life expectancy should increase with income
      expect(highIncome!).toBeGreaterThan(midIncome!);
      expect(midIncome!).toBeGreaterThan(lowIncome!);
    });

    it('should log warning for invalid percentile', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      getLifeExpectancyByIncome('male', 150);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid percentile: 150')
      );

      consoleSpy.mockRestore();
    });

    it('should handle negative percentile', () => {
      const result = getLifeExpectancyByIncome('male', -5);

      expect(result).toBeNull();
    });
  });

  describe('getLifeExpectancySource', () => {
    it('should return income source for USA with income percentile', () => {
      const result = getLifeExpectancySource('USA', 50);

      expect(result.type).toBe('income');
      expect(result.dataSource).toBe('Health Inequality Project');
      expect(result.description).toContain('US income data');
      expect(result.description).toContain('50th percentile');
      expect(result.details?.country).toBe('USA');
      expect(result.details?.incomePercentile).toBe(50);
    });

    it('should return country source for USA without income percentile', () => {
      const result = getLifeExpectancySource('USA', undefined);

      expect(result.type).toBe('country');
      expect(result.dataSource).toBe('WHO');
      expect(result.description).toContain('USA country data');
      expect(result.details?.country).toBe('USA');
    });

    it('should return country source for non-US country', () => {
      const result = getLifeExpectancySource('CAN', 50);

      expect(result.type).toBe('country');
      expect(result.dataSource).toBe('WHO');
      expect(result.description).toContain('CAN country data');
    });

    it('should return country source for null country', () => {
      const result = getLifeExpectancySource(null, undefined);

      expect(result.type).toBe('country');
      expect(result.dataSource).toBe('WHO');
      expect(result.description).toContain('Global country data');
      expect(result.details?.country).toBeUndefined();
    });

    it('should include all income percentiles (1-100) in description', () => {
      for (let percentile = 1; percentile <= 100; percentile++) {
        const result = getLifeExpectancySource('USA', percentile);

        expect(result.description).toContain(`${percentile}th percentile`);
      }
    });
  });
});
