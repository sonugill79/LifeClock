import {
  differenceInWeeks,
  differenceInYears,
  addWeeks,
  format,
} from 'date-fns';
import type { TimelineGranularity, TimelineData, TimelineUnit, GridLayout } from '../types';

/**
 * Calculate timeline data for a specific granularity
 */
export function calculateTimelineData(
  birthday: Date,
  currentTime: Date,
  lifeExpectancy: number,
  granularity: TimelineGranularity
): TimelineData {
  switch (granularity) {
    case 'years':
      return calculateYearsTimeline(birthday, currentTime, lifeExpectancy);
    case 'months':
      return calculateMonthsTimeline(birthday, currentTime, lifeExpectancy);
    case 'weeks':
      return calculateWeeksTimeline(birthday, currentTime, lifeExpectancy);
  }
}

/**
 * MONTHS VIEW: 12 columns x N rows (calendar-year aligned)
 * Each row represents a calendar year (Jan-Dec)
 * Months before birth are shown as empty placeholders
 */
function calculateMonthsTimeline(
  birthday: Date,
  currentTime: Date,
  lifeExpectancy: number
): TimelineData {
  const birthYear = birthday.getFullYear();
  const birthMonth = birthday.getMonth(); // 0-indexed (0 = Jan)

  const currentYear = currentTime.getFullYear();
  const currentMonth = currentTime.getMonth();

  // Calculate how many years to display (from birth year to expected death year)
  const expectedDeathYear = birthYear + Math.ceil(lifeExpectancy);
  const totalYears = expectedDeathYear - birthYear + 1;
  const totalUnits = totalYears * 12; // Total grid cells including pre-birth

  const columns = 12; // Jan-Dec
  const rows = totalYears;

  const units: TimelineUnit[] = [];
  let livedCount = 0;
  let currentUnitIndex = -1;

  // Iterate through each calendar year
  for (let yearOffset = 0; yearOffset < totalYears; yearOffset++) {
    const year = birthYear + yearOffset;
    const isBirthYear = year === birthYear;

    // Iterate through each month (0-11 for Jan-Dec)
    for (let monthNum = 0; monthNum < 12; monthNum++) {
      const index = yearOffset * 12 + monthNum;

      // Check if this month is before birth
      const isPreBirth = isBirthYear && monthNum < birthMonth;

      // For calendar calculations
      const isCurrentMonth = year === currentYear && monthNum === currentMonth;
      const isPastMonth = year < currentYear || (year === currentYear && monthNum < currentMonth);

      let detailsText: string;
      let label: string;
      let age: number;
      let isLived: boolean;
      let isCurrent: boolean;

      if (isPreBirth) {
        // Pre-birth placeholder
        const monthDate = new Date(year, monthNum, 1);
        label = format(monthDate, 'MMM yyyy');
        detailsText = `Born ${format(birthday, 'MMMM dd, yyyy')}`;
        age = 0;
        isLived = false;
        isCurrent = false;
      } else {
        // Actual lived or future month
        const monthDate = new Date(year, monthNum, 1);
        label = format(monthDate, 'MMM yyyy');

        // Calculate age for this month
        const yearsSinceBirth = year - birthYear;
        const isBirthdayMonth = monthNum === birthMonth;

        if (isBirthdayMonth) {
          // Birthday month: show age transition
          if (yearsSinceBirth === 0) {
            // Birth month itself
            detailsText = `${format(monthDate, 'MMMM yyyy')} (Age 0)`;
            age = 0;
          } else {
            // Subsequent birthday months
            const ageBeforeBirthday = yearsSinceBirth - 1;
            const ageAfterBirthday = yearsSinceBirth;
            detailsText = `${format(monthDate, 'MMMM yyyy')} (Age ${ageBeforeBirthday} → ${ageAfterBirthday})`;
            age = ageAfterBirthday;
          }
        } else {
          // Regular month
          age = monthNum > birthMonth ? yearsSinceBirth : yearsSinceBirth - 1;
          if (yearsSinceBirth === 0 && monthNum < birthMonth) {
            age = 0; // Still in birth year before birthday
          }
          detailsText = `${format(monthDate, 'MMMM yyyy')} (Age ${age})`;
        }

        isLived = isPastMonth;
        isCurrent = isCurrentMonth;

        if (isLived || isCurrent) {
          livedCount++;
        }

        if (isCurrent) {
          currentUnitIndex = index;
        }
      }

      units.push({
        index,
        isLived,
        isCurrent,
        isPreBirth,
        label,
        detailsText,
        age,
      });
    }
  }

  const layout: GridLayout = {
    rows,
    columns,
    totalUnits,
    livedUnits: livedCount,
    remainingUnits: totalUnits - livedCount - (currentUnitIndex >= 0 ? 1 : 0),
    currentUnit: currentUnitIndex,
    percentComplete: (livedCount / totalUnits) * 100,
  };

  return { layout, units };
}

/**
 * WEEKS VIEW: 52 columns x N rows (each row = 1 year)
 * Total: lifeExpectancy * 52 weeks
 */
function calculateWeeksTimeline(
  birthday: Date,
  currentTime: Date,
  lifeExpectancy: number
): TimelineData {
  const totalWeeks = Math.ceil(lifeExpectancy * 52);
  const livedWeeks = differenceInWeeks(currentTime, birthday);
  const currentWeek = livedWeeks;

  const birthMonth = birthday.getMonth();
  const birthDay = birthday.getDate();

  // 52 columns (weeks per year) - visually represents years as rows
  const columns = 52;
  const rows = Math.ceil(totalWeeks / columns);

  const units: TimelineUnit[] = [];

  for (let i = 0; i < totalWeeks; i++) {
    const weekStartDate = addWeeks(birthday, i);
    const weekEndDate = addWeeks(weekStartDate, 1);

    const isLived = i < livedWeeks;
    const isCurrent = i === currentWeek;

    // Check if birthday falls within this week
    const birthdayOccurrences = [];
    for (let year = birthday.getFullYear(); year <= weekEndDate.getFullYear(); year++) {
      const birthdayThisYear = new Date(year, birthMonth, birthDay);
      if (birthdayThisYear >= weekStartDate && birthdayThisYear < weekEndDate) {
        birthdayOccurrences.push(birthdayThisYear);
      }
    }

    const containsBirthday = birthdayOccurrences.length > 0;

    let detailsText: string;
    let age: number;

    const weekNumber = i + 1; // Start from Week 1 instead of Week 0

    if (containsBirthday && i > 0) {
      // Week contains birthday: show age transition
      const ageBeforeBirthday = differenceInYears(weekStartDate, birthday);
      const ageAfterBirthday = ageBeforeBirthday + 1;

      detailsText = `Week ${weekNumber.toLocaleString()}: ${format(weekStartDate, 'MMM dd')}-${format(weekEndDate, 'MMM dd, yyyy')} (Age ${ageBeforeBirthday} → ${ageAfterBirthday})`;
      age = ageAfterBirthday;
    } else {
      // Regular week: show the age during this week
      age = differenceInYears(weekStartDate, birthday);
      detailsText = `Week ${weekNumber.toLocaleString()}: ${format(weekStartDate, 'MMM dd')}-${format(weekEndDate, 'MMM dd, yyyy')} (Age ${age})`;
    }

    units.push({
      index: i,
      isLived,
      isCurrent,
      isPreBirth: false, // Weeks view doesn't show pre-birth
      label: format(weekStartDate, 'MMM dd, yyyy'),
      detailsText,
      age,
    });
  }

  const layout: GridLayout = {
    rows,
    columns,
    totalUnits: totalWeeks,
    livedUnits: Math.min(livedWeeks, totalWeeks),
    remainingUnits: Math.max(totalWeeks - livedWeeks, 0),
    currentUnit: currentWeek,
    percentComplete: (livedWeeks / totalWeeks) * 100,
  };

  return { layout, units };
}

/**
 * YEARS VIEW: Each icon represents 1 year
 * Layout: 10 columns for nice visual balance (each row = decade)
 */
function calculateYearsTimeline(
  birthday: Date,
  currentTime: Date,
  lifeExpectancy: number
): TimelineData {
  const totalYears = Math.ceil(lifeExpectancy);
  const livedYears = differenceInYears(currentTime, birthday);

  const birthYear = birthday.getFullYear();
  const currentCalendarYear = currentTime.getFullYear();
  const birthMonth = birthday.getMonth();
  const birthDay = birthday.getDate();

  // Current year index is based on calendar year, not age
  const currentYearIndex = currentCalendarYear - birthYear;

  // Check if birthday has passed this year
  const birthdayThisYear = new Date(currentCalendarYear, birthMonth, birthDay);
  const birthdayHasPassed = currentTime >= birthdayThisYear;

  // Layout: 10 columns (each row represents a decade)
  const columns = 10;
  const rows = Math.ceil(totalYears / columns);

  const units: TimelineUnit[] = [];

  for (let i = 0; i < totalYears; i++) {
    const calendarYear = birthYear + i;
    const isLived = calendarYear < currentCalendarYear;
    const isCurrent = i === currentYearIndex;

    // Age they turn this year
    const ageTurnedThisYear = i;

    let detailsText: string;

    if (isCurrent) {
      // Current year: "2026 (Currently 46, turning 47 on Jan 15)"
      const currentAge = birthdayHasPassed ? ageTurnedThisYear : ageTurnedThisYear - 1;
      const turningAge = ageTurnedThisYear;
      const monthName = format(birthday, 'MMM');

      if (birthdayHasPassed) {
        detailsText = `${calendarYear} (Age ${currentAge})`;
      } else {
        detailsText = `${calendarYear} (Currently ${currentAge}, turning ${turningAge} on ${monthName} ${birthDay})`;
      }
    } else if (isLived) {
      // Past year: "2025 (Age 46)" - the age they turned
      detailsText = `${calendarYear} (Age ${ageTurnedThisYear})`;
    } else {
      // Future year: "2027 (Age 48)" - the age they'll end the year on
      detailsText = `${calendarYear} (Age ${ageTurnedThisYear})`;
    }

    units.push({
      index: i,
      isLived,
      isCurrent,
      isPreBirth: false, // Years view doesn't show pre-birth
      label: `${calendarYear}`,
      detailsText,
      age: ageTurnedThisYear,
    });
  }

  const layout: GridLayout = {
    rows,
    columns,
    totalUnits: totalYears,
    livedUnits: currentYearIndex,
    remainingUnits: Math.max(totalYears - currentYearIndex - 1, 0),
    currentUnit: currentYearIndex,
    percentComplete: (currentYearIndex / totalYears) * 100,
    actualYears: livedYears,
    actualTotalYears: totalYears,
  };

  return { layout, units };
}

/**
 * Get display name for granularity
 */
export function getGranularityLabel(granularity: TimelineGranularity): string {
  switch (granularity) {
    case 'years':
      return 'Years';
    case 'months':
      return 'Months';
    case 'weeks':
      return 'Weeks';
  }
}

/**
 * Get unit name for display (singular/plural)
 */
export function getUnitName(granularity: TimelineGranularity, count: number): string {
  if (count === 1) {
    // Remove 's' for singular
    return granularity.slice(0, -1);
  }
  return granularity;
}
