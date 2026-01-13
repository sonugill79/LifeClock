/**
 * milestoneCalculations.ts
 *
 * Purpose: Calculation logic for all milestone types (seasons, birthdays, weekends)
 * Phase: Phase 2.1-2.6 - Milestone Calculations
 * Dependencies: date-fns, types/milestones
 * Used by: useMilestones hook
 */

import {
  getMonth,
  getDate,
  differenceInYears,
  eachWeekendOfInterval,
} from 'date-fns';
import { Milestone, MilestoneType, HolidayDefinition } from '../types/milestones';
import { holidayCalculators } from './holidayCalculations';

/**
 * Determines if a date falls within a specific season (Northern Hemisphere)
 * @param date - The date to check
 * @param season - The season to check
 * @returns boolean
 */
export function isInSeason(date: Date, season: string): boolean {
  const month = getMonth(date); // 0-11
  const day = getDate(date);

  switch (season) {
    case 'summer': // June 21 - Sept 20
      return (
        (month === 5 && day >= 21) ||
        month === 6 ||
        month === 7 ||
        (month === 8 && day <= 20)
      );
    case 'fall': // Sept 21 - Dec 20
      return (
        (month === 8 && day >= 21) ||
        month === 9 ||
        month === 10 ||
        (month === 11 && day <= 20)
      );
    case 'winter': // Dec 21 - March 19
      return (
        (month === 11 && day >= 21) ||
        month === 0 ||
        month === 1 ||
        (month === 2 && day <= 19)
      );
    case 'spring': // March 20 - June 20
      return (
        (month === 2 && day >= 20) ||
        month === 3 ||
        month === 4 ||
        (month === 5 && day <= 20)
      );
    default:
      return false;
  }
}

/**
 * Gets the start date of a season for a given year
 * @param year - The year
 * @param season - The season
 * @returns Date object for season start
 */
function getSeasonStartDate(year: number, season: string): Date {
  switch (season) {
    case 'spring':
      return new Date(year, 2, 20); // March 20
    case 'summer':
      return new Date(year, 5, 21); // June 21
    case 'fall':
      return new Date(year, 8, 21); // Sept 21
    case 'winter':
      return new Date(year, 11, 21); // Dec 21
    default:
      throw new Error(`Unknown season: ${season}`);
  }
}

/**
 * Counts how many times a season occurs between two dates
 * @param startDate - Start date (current date)
 * @param endDate - End date (life expectancy date)
 * @param season - The season to count
 * @returns number of seasons remaining
 */
export function countSeasons(
  startDate: Date,
  endDate: Date,
  season: string
): number {
  let count = 0;

  // If currently in the season, count it
  if (isInSeason(startDate, season)) {
    count = 1;
  }

  // Count future occurrences
  const currentYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  for (let year = currentYear; year <= endYear; year++) {
    const seasonStart = getSeasonStartDate(year, season);

    // Only count if season start is after current date and before end date
    if (seasonStart > startDate && seasonStart <= endDate) {
      count++;
    }
  }

  return count;
}

/**
 * Counts remaining birthdays
 * @param birthDate - User's birth date
 * @param currentDate - Current date
 * @param lifeExpectancyDate - Expected end date
 * @returns number of birthdays remaining
 */
export function countBirthdays(
  birthDate: Date,
  currentDate: Date,
  lifeExpectancyDate: Date
): number {
  const currentAge = differenceInYears(currentDate, birthDate);
  const finalAge = differenceInYears(lifeExpectancyDate, birthDate);

  // Check if birthday has occurred this year
  const birthdayThisYear = new Date(
    currentDate.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  const birthdayOccurredThisYear = currentDate >= birthdayThisYear;

  // If birthday already happened this year, we don't count it
  // If birthday hasn't happened yet this year, we count it
  const adjustment = birthdayOccurredThisYear ? 0 : 1;

  return finalAge - currentAge + adjustment;
}

/**
 * Counts remaining weekends (Saturday-Sunday pairs)
 * @param currentDate - Current date
 * @param lifeExpectancyDate - Expected end date
 * @returns number of weekends remaining
 */
export function countWeekends(
  currentDate: Date,
  lifeExpectancyDate: Date
): number {
  try {
    // eachWeekendOfInterval returns array of weekend days (both Sat and Sun)
    // So we divide by 2 to get number of weekend pairs
    const weekendDays = eachWeekendOfInterval({
      start: currentDate,
      end: lifeExpectancyDate,
    });

    // Each weekend has 2 days (Sat + Sun), so divide by 2
    return Math.floor(weekendDays.length / 2);
  } catch (error) {
    console.error('Error calculating weekends:', error);
    return 0;
  }
}

/**
 * Counts occurrences of a specific holiday
 * @param holiday - Holiday definition
 * @param currentDate - Current date
 * @param lifeExpectancyDate - Expected end date
 * @returns number of holiday occurrences remaining
 */
export function countHoliday(
  holiday: HolidayDefinition,
  currentDate: Date,
  lifeExpectancyDate: Date
): number {
  const currentYear = currentDate.getFullYear();
  const endYear = lifeExpectancyDate.getFullYear();
  let count = 0;

  for (let year = currentYear; year <= endYear; year++) {
    let holidayDate: Date;

    if (holiday.type === 'fixed' && holiday.date) {
      // Parse MM/DD format
      const [month, day] = holiday.date.split('/').map(Number);
      holidayDate = new Date(year, month - 1, day);
    } else if (holiday.type === 'calculated' && holiday.calculateFn) {
      // Use calculation function
      const calculateFn = holidayCalculators[holiday.calculateFn];
      if (!calculateFn) {
        console.error(`Unknown calculation function: ${holiday.calculateFn}`);
        continue;
      }
      holidayDate = calculateFn(year);
    } else {
      console.error('Invalid holiday definition:', holiday);
      continue;
    }

    // Count if holiday is between current date and life expectancy
    if (holidayDate >= currentDate && holidayDate <= lifeExpectancyDate) {
      count++;
    }
  }

  return count;
}

/**
 * Calculates a specific milestone count
 * @param type - Type of milestone
 * @param birthDate - User's birth date
 * @param currentDate - Current date
 * @param lifeExpectancyDate - Expected end date
 * @returns Milestone object with count
 */
export function calculateMilestone(
  type: MilestoneType,
  birthDate: Date,
  currentDate: Date,
  lifeExpectancyDate: Date
): Milestone {
  let count = 0;
  let label = '';
  let icon = '';
  let description = '';

  switch (type) {
    case 'birthdays':
      count = countBirthdays(birthDate, currentDate, lifeExpectancyDate);
      label = 'Birthdays';
      icon = '🎂';
      description = `You have ${count} more birthdays to celebrate`;
      break;

    case 'summers':
      count = countSeasons(currentDate, lifeExpectancyDate, 'summer');
      label = 'Summers';
      icon = '☀️';
      description = `${count} more summers to enjoy warm days`;
      break;

    case 'winters':
      count = countSeasons(currentDate, lifeExpectancyDate, 'winter');
      label = 'Winters';
      icon = '❄️';
      description = `${count} more winters to experience`;
      break;

    case 'spring':
      count = countSeasons(currentDate, lifeExpectancyDate, 'spring');
      label = 'Springs';
      icon = '🌸';
      description = `${count} more springs to see flowers bloom`;
      break;

    case 'fall':
      count = countSeasons(currentDate, lifeExpectancyDate, 'fall');
      label = 'Falls';
      icon = '🍂';
      description = `${count} more autumns to see leaves change`;
      break;

    case 'weekends':
      count = countWeekends(currentDate, lifeExpectancyDate);
      label = 'Weekends';
      icon = '🏖️';
      description = `${count} more weekends to recharge and explore`;
      break;

    default:
      throw new Error(`Unknown milestone type: ${type}`);
  }

  return {
    id: type,
    type,
    label,
    icon,
    count,
    description,
  };
}

/**
 * Calculates all milestones for the selected types
 * @param selectedTypes - Array of milestone types to calculate
 * @param birthDate - User's birth date
 * @param currentDate - Current date
 * @param lifeExpectancyDate - Expected end date
 * @returns Array of Milestone objects
 */
export function calculateAllMilestones(
  selectedTypes: MilestoneType[],
  birthDate: Date,
  currentDate: Date,
  lifeExpectancyDate: Date
): Milestone[] {
  return selectedTypes.map(type =>
    calculateMilestone(type, birthDate, currentDate, lifeExpectancyDate)
  );
}
