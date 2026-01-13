/**
 * useFutureOutlookStorage.ts
 *
 * Purpose: LocalStorage management for Future Outlook user preferences
 * Phase: Phase 1.4 - Core Infrastructure
 * Dependencies: hooks/useLocalStorage, types/milestones
 * Used by: FutureOutlook and MilestoneConfig components
 */

import { useLocalStorage } from './useLocalStorage';
import { FutureOutlookData, CustomHoliday } from '../types/milestones';

/**
 * Default data for new users
 * Per design decisions: birthdays, summers, weekends enabled by default
 */
const DEFAULT_DATA: FutureOutlookData = {
  selectedMilestones: ['birthdays', 'summers', 'weekends'],
  selectedHolidays: [],
  customHolidays: [],
  showMotivational: true,
  viewMode: 'remaining',
  lastUpdated: new Date().toISOString(),
};

/**
 * Custom hook to manage Future Outlook data in localStorage
 * @returns Object with data and update functions
 */
export function useFutureOutlookStorage() {
  const [data, setData] = useLocalStorage<FutureOutlookData>(
    'lifeclock-future-outlook',
    DEFAULT_DATA
  );

  const updateMilestones = (milestones: string[]) => {
    setData({
      ...data,
      selectedMilestones: milestones,
      lastUpdated: new Date().toISOString()
    });
  };

  const updateHolidays = (holidays: string[]) => {
    setData({
      ...data,
      selectedHolidays: holidays,
      lastUpdated: new Date().toISOString()
    });
  };

  const addCustomHoliday = (holiday: CustomHoliday) => {
    setData({
      ...data,
      customHolidays: [...data.customHolidays, holiday],
      lastUpdated: new Date().toISOString(),
    });
  };

  const removeCustomHoliday = (id: string) => {
    setData({
      ...data,
      customHolidays: data.customHolidays.filter(h => h.id !== id),
      lastUpdated: new Date().toISOString(),
    });
  };

  const toggleMotivational = () => {
    setData({
      ...data,
      showMotivational: !data.showMotivational,
      lastUpdated: new Date().toISOString()
    });
  };

  const setViewMode = (mode: 'remaining' | 'comparison') => {
    setData({
      ...data,
      viewMode: mode,
      lastUpdated: new Date().toISOString()
    });
  };

  return {
    data,
    updateMilestones,
    updateHolidays,
    addCustomHoliday,
    removeCustomHoliday,
    toggleMotivational,
    setViewMode,
  };
}
