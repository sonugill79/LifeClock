/**
 * useMilestones.ts
 *
 * Purpose: Custom hook for milestone calculations with real-time updates
 * Phase: Phase 3.5 - UI Components
 * Dependencies: utils/milestoneCalculations, types/milestones
 * Used by: FutureOutlook component
 */

import { useState, useEffect, useMemo } from 'react';
import { Milestone, FutureOutlookData, MilestoneType, HolidayDefinition } from '../types/milestones';
import { calculateAllMilestones, countHoliday } from '../utils/milestoneCalculations';
import holidaysDataRaw from '../data/holidays.json';

// Type assertion for holidays data
const holidaysData = holidaysDataRaw as {
  fixed: HolidayDefinition[];
  calculated: HolidayDefinition[];
};

/**
 * Custom hook to calculate and manage milestones
 * Recalculates when date changes (checks every minute)
 */
export function useMilestones(
  birthDate: Date,
  lifeExpectancyDate: Date,
  settings: FutureOutlookData
): Milestone[] {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update current date every minute to detect day changes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      // Only update state if date changed (not just time)
      if (now.toDateString() !== currentDate.toDateString()) {
        setCurrentDate(now);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentDate]);

  // Calculate milestones (memoized to avoid unnecessary recalculations)
  const milestones = useMemo(() => {
    // Calculate standard milestones
    const standardMilestones = calculateAllMilestones(
      settings.selectedMilestones as MilestoneType[],
      birthDate,
      currentDate,
      lifeExpectancyDate
    );

    // Calculate holiday milestones
    const allHolidays = [...holidaysData.fixed, ...holidaysData.calculated];
    const holidayMilestones = settings.selectedHolidays
      .map(holidayId => {
        const holiday = allHolidays.find(h => h.id === holidayId);
        if (!holiday) return null;

        const count = countHoliday(holiday, currentDate, lifeExpectancyDate);

        return {
          id: `holiday-${holidayId}`,
          type: 'holidays' as MilestoneType,
          label: holiday.name,
          icon: holiday.icon,
          count,
          description: `${count} more ${holiday.name} celebrations`,
        };
      })
      .filter((m): m is Milestone => m !== null);

    return [...standardMilestones, ...holidayMilestones];
  }, [
    JSON.stringify(settings.selectedMilestones),
    JSON.stringify(settings.selectedHolidays),
    birthDate.getTime(),
    currentDate.toDateString(),
    lifeExpectancyDate.getTime()
  ]);

  return milestones;
}
