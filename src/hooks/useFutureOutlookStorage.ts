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
    if (!Array.isArray(milestones)) {
      console.error('[useFutureOutlookStorage] Invalid milestones:', milestones);
      return;
    }

    setData(currentData => ({
      ...currentData,
      selectedMilestones: milestones,
      lastUpdated: new Date().toISOString()
    }));
  };

  const updateHolidays = (holidays: string[]) => {
    if (!Array.isArray(holidays)) {
      console.error('[useFutureOutlookStorage] Invalid holidays:', holidays);
      return;
    }

    setData(currentData => ({
      ...currentData,
      selectedHolidays: holidays,
      lastUpdated: new Date().toISOString()
    }));
  };

  const addCustomHoliday = (holiday: CustomHoliday) => {
    setData(currentData => ({
      ...currentData,
      customHolidays: [...currentData.customHolidays, holiday],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const removeCustomHoliday = (id: string) => {
    setData(currentData => ({
      ...currentData,
      customHolidays: currentData.customHolidays.filter(h => h.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const toggleMotivational = () => {
    setData(currentData => ({
      ...currentData,
      showMotivational: !currentData.showMotivational,
      lastUpdated: new Date().toISOString()
    }));
  };

  const setViewMode = (mode: 'remaining' | 'comparison') => {
    setData(currentData => ({
      ...currentData,
      viewMode: mode,
      lastUpdated: new Date().toISOString()
    }));
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
