import { useState, useEffect, useMemo } from 'react';
import { calculateTimeLived, calculateTimeRemaining } from '../utils/timeCalculations';
import type { TimeLived } from '../types';

interface UseTimeDifferenceReturn {
  timeLived: TimeLived | null;
  timeRemaining: TimeLived | null;
  currentTime: Date;
}

/**
 * Custom hook to calculate time lived and time remaining with real-time updates
 * @param birthday - Date of birth
 * @param lifeExpectancy - Life expectancy in years
 * @returns Object with timeLived, timeRemaining, and currentTime
 */
export function useTimeDifference(
  birthday: Date | null,
  lifeExpectancy: number | null
): UseTimeDifferenceReturn {
  // State for current time, updates every second
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  // Set up interval to update current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Calculate time lived (memoized to prevent unnecessary recalculations)
  const timeLived = useMemo<TimeLived | null>(() => {
    if (!birthday) {
      return null;
    }

    return calculateTimeLived(birthday, currentTime);
  }, [birthday, currentTime]);

  // Calculate time remaining (memoized to prevent unnecessary recalculations)
  const timeRemaining = useMemo<TimeLived | null>(() => {
    if (!birthday || !lifeExpectancy) {
      return null;
    }

    return calculateTimeRemaining(birthday, lifeExpectancy, currentTime);
  }, [birthday, lifeExpectancy, currentTime]);

  return {
    timeLived,
    timeRemaining,
    currentTime,
  };
}
