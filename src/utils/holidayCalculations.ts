/**
 * holidayCalculations.ts
 *
 * Purpose: Calculation algorithms for computed holidays (Easter, Thanksgiving)
 * Phase: Phase 2.4 - Milestone Calculations
 * Dependencies: None (pure date math)
 * Used by: milestoneCalculations.ts
 */

/**
 * Calculates Easter Sunday for a given year
 * Uses Meeus/Jones/Butcher algorithm for computing Easter date
 * @param year - The year
 * @returns Date object for Easter Sunday
 */
export function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

/**
 * Calculates Thanksgiving (US) for a given year
 * Fourth Thursday of November
 * @param year - The year
 * @returns Date object for Thanksgiving
 */
export function calculateThanksgiving(year: number): Date {
  const november = new Date(year, 10, 1); // November 1st
  const firstDay = november.getDay(); // 0-6 (Sun-Sat)

  // Find first Thursday
  const daysUntilThursday = (4 - firstDay + 7) % 7;
  const firstThursday = 1 + daysUntilThursday;

  // Fourth Thursday is 3 weeks after first Thursday
  const fourthThursday = firstThursday + 21;

  return new Date(year, 10, fourthThursday);
}

/**
 * Registry of calculation functions
 * Maps function names to actual functions for dynamic lookup
 */
export const holidayCalculators: Record<string, (year: number) => Date> = {
  calculateEaster,
  calculateThanksgiving,
};
