import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  addYears,
  addMonths,
  isBefore,
  isAfter,
} from 'date-fns';
import type { TimeLived } from '../types';

/**
 * Calculate the exact time lived from birthday to current time
 * @param birthday - Date of birth
 * @param currentTime - Current date/time
 * @returns TimeLived object with years, months, days, hours, minutes, seconds
 */
export function calculateTimeLived(
  birthday: Date,
  currentTime: Date
): TimeLived {
  // Ensure birthday is before current time
  if (isAfter(birthday, currentTime)) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
    };
  }

  // Calculate years
  const years = differenceInYears(currentTime, birthday);

  // Calculate remaining months after years
  const afterYears = addYears(birthday, years);
  const months = differenceInMonths(currentTime, afterYears);

  // Calculate remaining days after months
  const afterMonths = addMonths(afterYears, months);
  const days = differenceInDays(currentTime, afterMonths);

  // Calculate remaining hours, minutes, seconds
  const hours = differenceInHours(currentTime, afterMonths) % 24;
  const minutes = differenceInMinutes(currentTime, afterMonths) % 60;
  const seconds = differenceInSeconds(currentTime, afterMonths) % 60;

  // Calculate total seconds for reference
  const totalSeconds = differenceInSeconds(currentTime, birthday);

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
  };
}

/**
 * Calculate the time remaining until expected death based on life expectancy
 * @param birthday - Date of birth
 * @param lifeExpectancyYears - Life expectancy in years
 * @param currentTime - Current date/time
 * @returns TimeLived object with time remaining, or zeros if past expectancy
 */
export function calculateTimeRemaining(
  birthday: Date,
  lifeExpectancyYears: number,
  currentTime: Date
): TimeLived {
  // Calculate expected death date
  const expectedDeathDate = addYears(birthday, lifeExpectancyYears);

  // If current time is past expected death, return zeros
  // (we could also return bonus time, but zeros is clearer)
  if (isBefore(expectedDeathDate, currentTime)) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
    };
  }

  // Otherwise, calculate time from now to expected death
  return calculateTimeLived(currentTime, expectedDeathDate);
}

/**
 * Check if the user has exceeded their life expectancy
 * @param birthday - Date of birth
 * @param lifeExpectancyYears - Life expectancy in years
 * @param currentTime - Current date/time
 * @returns true if past life expectancy
 */
export function isOverLifeExpectancy(
  birthday: Date,
  lifeExpectancyYears: number,
  currentTime: Date
): boolean {
  const expectedDeathDate = addYears(birthday, lifeExpectancyYears);
  return isAfter(currentTime, expectedDeathDate);
}

/**
 * Format time components into a readable string
 * @param time - TimeLived object
 * @returns Formatted string like "25 years, 3 months, 15 days"
 */
export function formatTimeLived(time: TimeLived): string {
  const parts: string[] = [];

  if (time.years > 0) {
    parts.push(`${time.years} year${time.years !== 1 ? 's' : ''}`);
  }
  if (time.months > 0) {
    parts.push(`${time.months} month${time.months !== 1 ? 's' : ''}`);
  }
  if (time.days > 0) {
    parts.push(`${time.days} day${time.days !== 1 ? 's' : ''}`);
  }

  return parts.join(', ');
}

/**
 * Format time as HH:MM:SS
 * @param hours - Hours
 * @param minutes - Minutes
 * @param seconds - Seconds
 * @returns Formatted string like "12:34:56"
 */
export function formatTime(
  hours: number,
  minutes: number,
  seconds: number
): string {
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
