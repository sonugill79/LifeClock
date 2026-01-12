# Future Outlook - Implementation Plan

**Feature:** Future Outlook (Life Milestones)
**PRD Reference:** PRD_FUTURE_OUTLOOK.md
**Start Date:** 2026-01-12
**Status:** ✅ Approved & Ready for Implementation
**All Design Decisions:** Finalized (see below)
**Current Phase:** Phase 0 - Setup

---

## Quick Start Guide for AI Assistants

**If you're picking up this implementation:**

1. Read the `PRD_FUTURE_OUTLOOK.md` file first to understand the feature
2. Check the "Current Phase" status above
3. Find the next task with status `[ ]` (pending) in the current phase
4. Mark it `[>]` (in-progress) when you start
5. Complete the task following the acceptance criteria
6. Mark it `[x]` (completed) when done
7. Update "Last Updated" timestamp at the bottom
8. Move to the next task

**Status Legend:**
- `[ ]` Pending (not started)
- `[>]` In Progress (currently working on)
- `[x]` Completed
- `[!]` Blocked (cannot proceed, needs resolution)
- `[-]` Skipped (decided not to implement)

---

## Implementation Phases Overview

```
Phase 0: Setup & Planning ────────────────── (Est: 30 mins)
Phase 1: Core Infrastructure ───────────── (Est: 2-3 hours)
Phase 2: Milestone Calculations ────────── (Est: 3-4 hours)
Phase 3: UI Components ─────────────────── (Est: 4-5 hours)
Phase 4: Configuration System ──────────── (Est: 3-4 hours)
Phase 5: Integration & Polish ──────────── (Est: 2-3 hours)
Phase 6: Testing & Documentation ───────── (Est: 2 hours)
```

**Total Estimated Time:** 16-21 hours

---

## Finalized Design Decisions

**✅ All decisions finalized on 2026-01-12**

These decisions have been made by the product owner and should be implemented exactly as specified:

### Core Feature Decisions
1. **Default Milestones:** Birthdays, Summers, Weekends (3 milestones enabled by default)
2. **Holidays in v1.0:**
   - **Fixed:** Christmas, New Year's Day, New Year's Eve, Independence Day (US), Valentine's Day, Halloween
   - **Calculated:** Easter, Thanksgiving (US) ✓ Included per decision
   - **Note:** None selected by default - user must opt-in
3. **Motivational Messaging:** Enabled by default with user toggle option
4. **View Mode:** "Remaining only" (lived vs. remaining comparison deferred to v2.0)

### UI/UX Decisions
5. **Mobile Layout:** Auto-fit grid - `repeat(auto-fit, minmax(120px, 1fr))`
6. **Card Colors:** Single warm gradient for all cards (#ffeaa7 to #fdcb6e)
7. **Calculation Explanation:** Inline tooltips on hover/tap (description field)
8. **Motivational Tagline:** "Make every moment count"

### Deferred to Future Versions
- ❌ **Hemisphere Detection** → v2.1 (Northern hemisphere only for v1.0)
- ❌ **Timeline Integration** → v2.0 (separate section for v1.0)
- ❌ **Custom Holidays** (user-entered dates) → v2.1
- ❌ **Lived vs. Remaining Comparison** → v2.0
- ❌ **Per-Milestone Card Colors** → v1.1 (optional enhancement)

**Implementation Note:** Follow these decisions exactly. If you identify issues during implementation, document them in the "Implementation Notes" section but do not deviate without approval.

---

## Phase 0: Setup & Planning

**Goal:** Understand existing codebase structure and prepare for implementation

### Tasks

#### 0.1 Codebase Analysis
- [ ] **Task:** Read and understand existing architecture
  - **Files to Read:**
    - `src/App.tsx` - Main app structure and data flow
    - `src/types/index.ts` - Existing type definitions
    - `src/hooks/useLocalStorage.ts` - Storage pattern
    - `src/hooks/useLifeExpectancy.ts` - Life expectancy calculation
    - `src/hooks/useTimeDifference.ts` - Real-time update pattern
    - `src/utils/timeCalculations.ts` - Date math utilities
  - **Acceptance Criteria:**
    - Understand how data flows from localStorage → state → hooks → components
    - Identify where Future Outlook will integrate in component tree
    - Understand existing styling patterns (CSS modules vs inline)
  - **Notes:** Document key patterns in task completion comment

#### 0.2 Dependency Check
- [ ] **Task:** Verify date-fns functions available
  - **Command:** `npm list date-fns`
  - **Files to Check:** `package.json`
  - **Verify Functions Available:**
    - `eachWeekendOfInterval`
    - `eachYearOfInterval`
    - `differenceInDays`
    - `isWithinInterval`
    - `addYears`
    - `getMonth`, `getDate`
  - **Acceptance Criteria:**
    - date-fns version is 4.1.0 or higher
    - All required functions exist in the library
  - **Action if Missing:** Document which functions need alternatives

#### 0.3 Create Branch
- [ ] **Task:** Create feature branch for development
  - **Command:** `git checkout -b feat/future-outlook`
  - **Acceptance Criteria:**
    - New branch created from current `feat/gender-inclusivity`
    - Working directory is clean
  - **Note:** Current branch is `feat/gender-inclusivity`, may need to merge/rebase first

#### 0.4 File Structure Planning
- [ ] **Task:** Create empty files with TODO comments
  - **Files to Create:**
    ```
    src/types/milestones.ts
    src/data/holidays.json
    src/utils/milestoneCalculations.ts
    src/utils/holidayCalculations.ts
    src/hooks/useMilestones.ts
    src/components/FutureOutlook/FutureOutlook.tsx
    src/components/FutureOutlook/FutureOutlook.module.css
    src/components/FutureOutlook/MilestoneCard.tsx
    src/components/FutureOutlook/MilestoneCard.module.css
    src/components/FutureOutlook/MilestoneConfig.tsx
    src/components/FutureOutlook/MilestoneConfig.module.css
    src/components/FutureOutlook/index.ts
    ```
  - **Acceptance Criteria:**
    - All files created with proper extensions
    - Each file has a header comment describing its purpose
    - TypeScript files have proper imports (React, types, etc.)
    - index.ts exports all components
  - **Template for each file:**
    ```typescript
    /**
     * [Filename]
     *
     * Purpose: [Brief description]
     * Phase: [Which phase implements this]
     * Dependencies: [What this file depends on]
     * Used by: [What uses this file]
     */
    ```

---

## Phase 1: Core Infrastructure

**Goal:** Set up TypeScript types, data structures, and storage schema

### Tasks

#### 1.1 Define TypeScript Types
- [ ] **Task:** Create comprehensive type definitions
  - **File:** `src/types/milestones.ts`
  - **Types to Define:**
    ```typescript
    // Milestone type enumeration
    export type MilestoneType =
      | 'birthdays'
      | 'summers'
      | 'winters'
      | 'spring'
      | 'fall'
      | 'weekends'
      | 'holidays';

    // Calculated milestone with count
    export interface Milestone {
      id: string;
      type: MilestoneType;
      label: string;
      icon: string;
      count: number;
      description: string;
    }

    // Holiday definition types
    export type HolidayType = 'fixed' | 'calculated' | 'custom';

    export interface HolidayDefinition {
      id: string;
      name: string;
      type: HolidayType;
      date?: string; // MM/DD for fixed/annual
      calculateFn?: string; // Function name for calculated holidays
    }

    // Custom holiday (user-created)
    export interface CustomHoliday {
      id: string;
      name: string;
      date: string; // MM/DD for annual, MM/DD/YYYY for one-time
      isAnnual: boolean;
    }

    // User preferences for Future Outlook
    export interface FutureOutlookData {
      selectedMilestones: string[];
      selectedHolidays: string[];
      customHolidays: CustomHoliday[];
      showMotivational: boolean;
      viewMode: 'remaining' | 'comparison';
      lastUpdated: string;
    }

    // Milestone calculation input
    export interface MilestoneCalculationInput {
      currentDate: Date;
      birthDate: Date;
      lifeExpectancyDate: Date;
      type: MilestoneType;
      holidayDate?: Date; // For specific holiday calculations
    }
    ```
  - **Acceptance Criteria:**
    - All types compile without errors
    - Types are exported properly
    - JSDoc comments added for each type/interface
  - **Validation:** Run `npx tsc -b` to check for errors

#### 1.2 Create Holiday Definitions Data
- [ ] **Task:** Create holidays.json with built-in holidays
  - **File:** `src/data/holidays.json`
  - **Structure:**
    ```json
    {
      "fixed": [
        {
          "id": "christmas",
          "name": "Christmas",
          "type": "fixed",
          "date": "12/25"
        },
        {
          "id": "new-years-day",
          "name": "New Year's Day",
          "type": "fixed",
          "date": "01/01"
        },
        {
          "id": "new-years-eve",
          "name": "New Year's Eve",
          "type": "fixed",
          "date": "12/31"
        },
        {
          "id": "independence-day-us",
          "name": "Independence Day (US)",
          "type": "fixed",
          "date": "07/04"
        },
        {
          "id": "valentines-day",
          "name": "Valentine's Day",
          "type": "fixed",
          "date": "02/14"
        },
        {
          "id": "halloween",
          "name": "Halloween",
          "type": "fixed",
          "date": "10/31"
        }
      ],
      "calculated": [
        {
          "id": "easter",
          "name": "Easter",
          "type": "calculated",
          "calculateFn": "calculateEaster"
        },
        {
          "id": "thanksgiving-us",
          "name": "Thanksgiving (US)",
          "type": "calculated",
          "calculateFn": "calculateThanksgiving"
        }
      ]
    }
    ```
  - **Acceptance Criteria:**
    - Valid JSON syntax
    - All holidays have required fields
    - Dates in MM/DD format
    - File imports without errors
  - **Validation:** Test with `JSON.parse()`
  - **Note:** Start with limited set, can expand later

#### 1.3 Extend LocalStorage Schema
- [ ] **Task:** Update useLocalStorage to support Future Outlook data
  - **File:** `src/hooks/useLocalStorage.ts` (READ ONLY - understand pattern)
  - **New Storage Key:** `'lifeclock-future-outlook'`
  - **Action:**
    - No changes needed to useLocalStorage hook itself
    - Document how to use it for Future Outlook data
    - Will create new hook in Phase 1.4 that uses useLocalStorage
  - **Acceptance Criteria:**
    - Understand useLocalStorage pattern
    - Confirmed it supports generic types
    - Ready to implement useFutureOutlookStorage

#### 1.4 Create Storage Hook for Future Outlook
- [ ] **Task:** Create hook to manage Future Outlook localStorage
  - **File:** `src/hooks/useFutureOutlookStorage.ts` (NEW FILE)
  - **Implementation:**
    ```typescript
    import { useLocalStorage } from './useLocalStorage';
    import { FutureOutlookData } from '../types/milestones';

    const DEFAULT_DATA: FutureOutlookData = {
      selectedMilestones: ['birthdays', 'summers', 'weekends'],
      selectedHolidays: [],
      customHolidays: [],
      showMotivational: true,
      viewMode: 'remaining',
      lastUpdated: new Date().toISOString(),
    };

    export function useFutureOutlookStorage() {
      const [data, setData] = useLocalStorage<FutureOutlookData>(
        'lifeclock-future-outlook',
        DEFAULT_DATA
      );

      const updateMilestones = (milestones: string[]) => {
        setData({ ...data, selectedMilestones: milestones, lastUpdated: new Date().toISOString() });
      };

      const updateHolidays = (holidays: string[]) => {
        setData({ ...data, selectedHolidays: holidays, lastUpdated: new Date().toISOString() });
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
        setData({ ...data, showMotivational: !data.showMotivational, lastUpdated: new Date().toISOString() });
      };

      const setViewMode = (mode: 'remaining' | 'comparison') => {
        setData({ ...data, viewMode: mode, lastUpdated: new Date().toISOString() });
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
    ```
  - **Acceptance Criteria:**
    - Hook compiles without errors
    - Default data structure matches FutureOutlookData type
    - All update functions properly type-checked
    - Exports all necessary functions
  - **Validation:** Import in a test component, verify no errors

---

## Phase 2: Milestone Calculations

**Goal:** Implement all calculation logic for milestones and holidays

### Tasks

#### 2.1 Implement Season Calculations
- [ ] **Task:** Create functions to calculate seasonal milestones
  - **File:** `src/utils/milestoneCalculations.ts`
  - **Functions to Implement:**
    ```typescript
    import { isWithinInterval, addYears, getMonth, getDate } from 'date-fns';

    /**
     * Determines if a date falls within a specific season
     * @param date - The date to check
     * @param season - The season to check ('summer', 'winter', 'spring', 'fall')
     * @returns boolean
     */
    export function isInSeason(date: Date, season: string): boolean {
      const month = getMonth(date); // 0-11
      const day = getDate(date);

      switch (season) {
        case 'summer': // June 21 - Sept 20
          return (month === 5 && day >= 21) || (month === 6) || (month === 7) || (month === 8 && day <= 20);
        case 'fall': // Sept 21 - Dec 20
          return (month === 8 && day >= 21) || (month === 9) || (month === 10) || (month === 11 && day <= 20);
        case 'winter': // Dec 21 - March 19
          return (month === 11 && day >= 21) || (month === 0) || (month === 1) || (month === 2 && day <= 19);
        case 'spring': // March 20 - June 20
          return (month === 2 && day >= 20) || (month === 3) || (month === 4) || (month === 5 && day <= 20);
        default:
          return false;
      }
    }

    /**
     * Counts how many times a season occurs between two dates
     * @param startDate - Start date (current date)
     * @param endDate - End date (life expectancy date)
     * @param season - The season to count
     * @returns number of seasons remaining
     */
    export function countSeasons(startDate: Date, endDate: Date, season: string): number {
      let count = 0;
      let currentDate = new Date(startDate);

      // If currently in the season, count it
      if (isInSeason(currentDate, season)) {
        count = 1;
      }

      // Count future occurrences
      const currentYear = currentDate.getFullYear();
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
    ```
  - **Acceptance Criteria:**
    - Functions compile without TypeScript errors
    - Season date ranges match PRD specifications
    - Functions handle edge cases (current season, partial years)
  - **Test Cases to Validate:**
    - If today is July 15, countSeasons includes current summer
    - If today is March 1, countSeasons doesn't include current spring yet
    - End date in middle of season counts that season

#### 2.2 Implement Birthday Calculations
- [ ] **Task:** Create function to count remaining birthdays
  - **File:** `src/utils/milestoneCalculations.ts` (APPEND)
  - **Function to Add:**
    ```typescript
    import { differenceInYears } from 'date-fns';

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
    ```
  - **Acceptance Criteria:**
    - Correctly handles whether birthday has occurred this year
    - Returns accurate count based on life expectancy
    - Handles leap year birthdays (Feb 29)
  - **Test Cases:**
    - User born Jan 15, today Jan 10 → includes this year's birthday
    - User born Jan 15, today Jan 20 → doesn't include this year's birthday

#### 2.3 Implement Weekend Calculations
- [ ] **Task:** Create function to count remaining weekends
  - **File:** `src/utils/milestoneCalculations.ts` (APPEND)
  - **Function to Add:**
    ```typescript
    import { eachWeekendOfInterval } from 'date-fns';

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
    ```
  - **Acceptance Criteria:**
    - Uses date-fns eachWeekendOfInterval correctly
    - Returns weekend pairs, not individual days
    - Handles invalid date ranges gracefully
  - **Test Cases:**
    - 7-day period should return 1-2 weekends
    - 1-year period should return ~52 weekends

#### 2.4 Implement Holiday Calculation Algorithms
- [ ] **Task:** Create calculated holiday functions (Easter, Thanksgiving, etc.)
  - **File:** `src/utils/holidayCalculations.ts`
  - **Functions to Implement:**
    ```typescript
    /**
     * Calculates Easter Sunday for a given year
     * Uses Meeus/Jones/Butcher algorithm
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
     * Maps function names to actual functions
     */
    export const holidayCalculators: Record<string, (year: number) => Date> = {
      calculateEaster,
      calculateThanksgiving,
    };
    ```
  - **Acceptance Criteria:**
    - Easter calculation accurate for years 2020-2100
    - Thanksgiving always on 4th Thursday of November
    - Functions handle edge cases (leap years, etc.)
  - **Validation:**
    - Test Easter 2026 = April 5
    - Test Thanksgiving 2026 = November 26
    - Test multiple years to ensure consistency

#### 2.5 Implement Generic Holiday Counter
- [ ] **Task:** Create function to count any holiday occurrences
  - **File:** `src/utils/milestoneCalculations.ts` (APPEND)
  - **Function to Add:**
    ```typescript
    import { holidayCalculators } from './holidayCalculations';
    import { HolidayDefinition } from '../types/milestones';

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
    ```
  - **Acceptance Criteria:**
    - Handles both fixed and calculated holidays
    - Correctly parses MM/DD date format
    - Only counts holidays within the date range
    - Handles invalid holiday definitions gracefully
  - **Test Cases:**
    - Christmas (fixed) counted correctly
    - Easter (calculated) counted correctly
    - Holiday before current date not counted

#### 2.6 Create Main Calculation Orchestrator
- [ ] **Task:** Create main function that calculates all milestones
  - **File:** `src/utils/milestoneCalculations.ts` (APPEND)
  - **Function to Add:**
    ```typescript
    import { Milestone, MilestoneType } from '../types/milestones';

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
    ```
  - **Acceptance Criteria:**
    - All milestone types handled in switch statement
    - Each milestone has appropriate icon and description
    - Returns properly typed Milestone objects
    - calculateAllMilestones maps over selected types correctly
  - **Validation:**
    - Call with each milestone type, verify output structure
    - Check that icons and descriptions are meaningful

#### 2.7 Test All Calculation Functions
- [ ] **Task:** Manual testing of all calculation functions
  - **Create Test File:** `test-milestones.mjs` (in project root)
  - **Test Script:**
    ```javascript
    import {
      calculateMilestone,
      calculateAllMilestones,
      countHoliday
    } from './src/utils/milestoneCalculations.ts';
    import { calculateEaster, calculateThanksgiving } from './src/utils/holidayCalculations.ts';

    // Test data
    const birthDate = new Date(1990, 0, 15); // Jan 15, 1990
    const currentDate = new Date(2026, 0, 12); // Jan 12, 2026
    const lifeExpectancyDate = new Date(2072, 0, 15); // Jan 15, 2072 (age 82)

    console.log('Testing Milestone Calculations:');
    console.log('Birth:', birthDate.toLocaleDateString());
    console.log('Current:', currentDate.toLocaleDateString());
    console.log('Life Expectancy:', lifeExpectancyDate.toLocaleDateString());
    console.log('---');

    // Test each milestone type
    const types = ['birthdays', 'summers', 'winters', 'spring', 'fall', 'weekends'];
    types.forEach(type => {
      const milestone = calculateMilestone(type, birthDate, currentDate, lifeExpectancyDate);
      console.log(`${milestone.icon} ${milestone.label}: ${milestone.count}`);
    });

    console.log('\nTesting Holiday Calculations:');
    console.log('Easter 2026:', calculateEaster(2026).toLocaleDateString());
    console.log('Thanksgiving 2026:', calculateThanksgiving(2026).toLocaleDateString());

    console.log('\nAll tests completed!');
    ```
  - **Run Command:** `node test-milestones.mjs`
  - **Acceptance Criteria:**
    - Script runs without errors
    - All milestone counts are reasonable (e.g., ~46 birthdays for 46 years remaining)
    - Seasonal counts are logical (~46 each season)
    - Weekends are ~2400 for 46 years
    - Easter 2026 = April 5
    - Thanksgiving 2026 = November 26
  - **Action:** Document any issues found and fix them
  - **Note:** Delete test file after validation or add to .gitignore

---

## Phase 3: UI Components

**Goal:** Build React components for displaying milestones

### Tasks

#### 3.1 Create MilestoneCard Component
- [ ] **Task:** Build individual milestone display card
  - **File:** `src/components/FutureOutlook/MilestoneCard.tsx`
  - **Component Structure:**
    ```typescript
    import React from 'react';
    import { Milestone } from '../../types/milestones';
    import styles from './MilestoneCard.module.css';

    interface MilestoneCardProps {
      milestone: Milestone;
      onClick?: () => void;
    }

    export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, onClick }) => {
      return (
        <div className={styles.card} onClick={onClick} title={milestone.description}>
          <div className={styles.icon}>{milestone.icon}</div>
          <div className={styles.count}>{milestone.count}</div>
          <div className={styles.label}>{milestone.label}</div>
        </div>
      );
    };
    ```
  - **Acceptance Criteria:**
    - Component renders without errors
    - Props are properly typed
    - Accessible (title for hover, keyboard support if clickable)
    - Clean structure ready for styling
  - **Validation:** Import in App.tsx temporarily, verify it renders

#### 3.2 Style MilestoneCard
- [ ] **Task:** Create CSS for milestone card
  - **File:** `src/components/FutureOutlook/MilestoneCard.module.css`
  - **Styling Requirements:**
    - Card dimensions: min 150px width, 180px height
    - Large icon at top (48px font size for emoji)
    - Very large count number (48-64px, bold, monospace like clocks)
    - Smaller label below count (14-16px)
    - Gradient background (warm tones: gold, amber, soft orange)
    - Rounded corners (12-16px border-radius)
    - Subtle shadow for depth
    - Hover effect (slight scale up, increased shadow)
    - Responsive (adjust size on mobile)
  - **Example CSS:**
    ```css
    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 150px;
      height: 180px;
      padding: 1.5rem;
      border-radius: 16px;
      background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }

    .icon {
      font-size: 48px;
      margin-bottom: 0.5rem;
    }

    .count {
      font-size: 48px;
      font-weight: 700;
      font-family: 'Courier New', monospace;
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .label {
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: rgba(0, 0, 0, 0.7);
    }

    @media (max-width: 768px) {
      .card {
        min-width: 120px;
        height: 160px;
        padding: 1rem;
      }

      .icon {
        font-size: 36px;
      }

      .count {
        font-size: 36px;
      }

      .label {
        font-size: 12px;
      }
    }
    ```
  - **Acceptance Criteria:**
    - Visually distinct from existing clock components
    - Warm, motivational color palette
    - Readable at all screen sizes
    - Smooth hover transitions
  - **Validation:** View in browser at multiple screen sizes

#### 3.3 Create FutureOutlook Main Component
- [ ] **Task:** Build main container component
  - **File:** `src/components/FutureOutlook/FutureOutlook.tsx`
  - **Component Structure:**
    ```typescript
    import React, { useState } from 'react';
    import { MilestoneCard } from './MilestoneCard';
    import { useMilestones } from '../../hooks/useMilestones';
    import { useFutureOutlookStorage } from '../../hooks/useFutureOutlookStorage';
    import styles from './FutureOutlook.module.css';

    interface FutureOutlookProps {
      birthDate: Date;
      lifeExpectancyDate: Date;
    }

    export const FutureOutlook: React.FC<FutureOutlookProps> = ({
      birthDate,
      lifeExpectancyDate,
    }) => {
      const { data, updateMilestones } = useFutureOutlookStorage();
      const milestones = useMilestones(birthDate, lifeExpectancyDate, data);
      const [showConfig, setShowConfig] = useState(false);

      if (milestones.length === 0) {
        return null;
      }

      return (
        <section className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Future Outlook</h2>
            {data.showMotivational && (
              <p className={styles.tagline}>Make every moment count</p>
            )}
            <button
              className={styles.configButton}
              onClick={() => setShowConfig(!showConfig)}
              aria-label="Configure milestones"
            >
              ⚙️
            </button>
          </div>

          <div className={styles.grid}>
            {milestones.map(milestone => (
              <MilestoneCard key={milestone.id} milestone={milestone} />
            ))}
          </div>

          {showConfig && (
            <div className={styles.configPanel}>
              {/* Will be implemented in Phase 4 */}
              <p>Configuration panel coming soon...</p>
            </div>
          )}
        </section>
      );
    };
    ```
  - **Acceptance Criteria:**
    - Component accepts required props (birthDate, lifeExpectancyDate)
    - Uses custom hooks for data and calculations
    - Renders grid of milestone cards
    - Config button toggles panel (placeholder for now)
    - Conditional rendering of motivational text
  - **Note:** useMilestones hook will be created in Phase 3.5

#### 3.4 Style FutureOutlook Component
- [ ] **Task:** Create CSS for main Future Outlook section
  - **File:** `src/components/FutureOutlook/FutureOutlook.module.css`
  - **Styling Requirements:**
    - Clear visual separation from clocks (margin/border/background)
    - Centered header with title and tagline
    - Config button in top-right corner
    - Grid layout: 2-4 columns on desktop, 1-2 on mobile
    - Even spacing between cards
    - Responsive design
  - **Example CSS:**
    ```css
    .container {
      margin-top: 3rem;
      padding: 2rem;
      border-top: 2px solid rgba(0, 0, 0, 0.1);
    }

    .header {
      position: relative;
      text-align: center;
      margin-bottom: 2rem;
    }

    .title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #2d3436;
    }

    .tagline {
      font-size: 1rem;
      font-style: italic;
      color: #636e72;
    }

    .configButton {
      position: absolute;
      top: 0;
      right: 0;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 0.5rem;
      transition: transform 0.2s ease;
    }

    .configButton:hover {
      transform: rotate(45deg);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .configPanel {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .title {
        font-size: 1.5rem;
      }

      .grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
      }
    }
    ```
  - **Acceptance Criteria:**
    - Clean separation from existing sections
    - Responsive grid that adapts to screen size
    - Professional, polished appearance
  - **Validation:** Test at 320px, 768px, 1024px, 1920px widths

#### 3.5 Create useMilestones Hook
- [ ] **Task:** Build custom hook for milestone calculations with real-time updates
  - **File:** `src/hooks/useMilestones.ts` (NEW FILE)
  - **Implementation:**
    ```typescript
    import { useState, useEffect, useMemo } from 'react';
    import { Milestone, FutureOutlookData } from '../types/milestones';
    import { calculateAllMilestones } from '../utils/milestoneCalculations';

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
        return calculateAllMilestones(
          settings.selectedMilestones as any, // Type cast for milestone types
          birthDate,
          currentDate,
          lifeExpectancyDate
        );
      }, [settings.selectedMilestones, birthDate, currentDate, lifeExpectancyDate]);

      return milestones;
    }
    ```
  - **Acceptance Criteria:**
    - Hook properly typed with TypeScript
    - Uses useMemo for performance optimization
    - Updates when date changes (not every second)
    - Follows existing hook patterns in codebase
  - **Validation:**
    - Import in FutureOutlook component
    - Verify it returns array of Milestone objects
    - Check that it doesn't cause performance issues

#### 3.6 Create Component Exports
- [ ] **Task:** Set up barrel export for components
  - **File:** `src/components/FutureOutlook/index.ts`
  - **Implementation:**
    ```typescript
    export { FutureOutlook } from './FutureOutlook';
    export { MilestoneCard } from './MilestoneCard';
    export { MilestoneConfig } from './MilestoneConfig'; // Will be added in Phase 4
    ```
  - **Acceptance Criteria:**
    - All components exported
    - Can import with `from '../../components/FutureOutlook'`
  - **Validation:** Test import in App.tsx

---

## Phase 4: Configuration System

**Goal:** Build UI for users to customize which milestones to track

### Tasks

#### 4.1 Create MilestoneConfig Component Structure
- [ ] **Task:** Build configuration panel component
  - **File:** `src/components/FutureOutlook/MilestoneConfig.tsx`
  - **Component Structure:**
    ```typescript
    import React, { useState } from 'react';
    import { FutureOutlookData } from '../../types/milestones';
    import styles from './MilestoneConfig.module.css';

    interface MilestoneConfigProps {
      data: FutureOutlookData;
      onUpdateMilestones: (milestones: string[]) => void;
      onToggleMotivational: () => void;
      onClose: () => void;
    }

    export const MilestoneConfig: React.FC<MilestoneConfigProps> = ({
      data,
      onUpdateMilestones,
      onToggleMotivational,
      onClose,
    }) => {
      const [selectedMilestones, setSelectedMilestones] = useState<string[]>(
        data.selectedMilestones
      );

      const availableMilestones = [
        { id: 'birthdays', label: 'Birthdays', icon: '🎂' },
        { id: 'summers', label: 'Summers', icon: '☀️' },
        { id: 'winters', label: 'Winters', icon: '❄️' },
        { id: 'spring', label: 'Springs', icon: '🌸' },
        { id: 'fall', label: 'Falls', icon: '🍂' },
        { id: 'weekends', label: 'Weekends', icon: '🏖️' },
      ];

      const toggleMilestone = (id: string) => {
        setSelectedMilestones(prev =>
          prev.includes(id)
            ? prev.filter(m => m !== id)
            : [...prev, id]
        );
      };

      const handleSave = () => {
        onUpdateMilestones(selectedMilestones);
        onClose();
      };

      return (
        <div className={styles.overlay} onClick={onClose}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.header}>
              <h3>Configure Future Outlook</h3>
              <button className={styles.closeButton} onClick={onClose}>
                ✕
              </button>
            </div>

            <div className={styles.content}>
              <section className={styles.section}>
                <h4>Select Milestones to Track</h4>
                <div className={styles.checkboxGrid}>
                  {availableMilestones.map(milestone => (
                    <label key={milestone.id} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={selectedMilestones.includes(milestone.id)}
                        onChange={() => toggleMilestone(milestone.id)}
                      />
                      <span className={styles.checkboxLabel}>
                        {milestone.icon} {milestone.label}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h4>Display Options</h4>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={data.showMotivational}
                    onChange={onToggleMotivational}
                  />
                  <span className={styles.checkboxLabel}>
                    Show motivational messages
                  </span>
                </label>
              </section>
            </div>

            <div className={styles.footer}>
              <button className={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>
              <button className={styles.saveButton} onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      );
    };
    ```
  - **Acceptance Criteria:**
    - Modal overlay with centered panel
    - Checkbox list for milestones
    - Save/Cancel buttons functional
    - Clicking overlay closes modal
    - Local state for selections before saving
  - **Note:** Holiday selection deferred to Phase 4.3

#### 4.2 Style MilestoneConfig Component
- [ ] **Task:** Create CSS for configuration modal
  - **File:** `src/components/FutureOutlook/MilestoneConfig.module.css`
  - **Styling Requirements:**
    - Full-screen overlay with semi-transparent background
    - Centered modal (max-width 600px)
    - Clean, organized sections
    - Prominent save button
    - Responsive (full-width on mobile)
  - **Example CSS:**
    ```css
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .header h3 {
      margin: 0;
      font-size: 1.5rem;
    }

    .closeButton {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 0.25rem;
      color: #636e72;
    }

    .closeButton:hover {
      color: #2d3436;
    }

    .content {
      padding: 1.5rem;
    }

    .section {
      margin-bottom: 2rem;
    }

    .section:last-child {
      margin-bottom: 0;
    }

    .section h4 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1rem;
      color: #2d3436;
    }

    .checkboxGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 0.75rem;
    }

    .checkbox {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: background 0.2s ease;
    }

    .checkbox:hover {
      background: #f8f9fa;
    }

    .checkbox input[type="checkbox"] {
      margin-right: 0.5rem;
      cursor: pointer;
    }

    .checkboxLabel {
      font-size: 14px;
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1.5rem;
      border-top: 1px solid #e0e0e0;
    }

    .cancelButton,
    .saveButton {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .cancelButton {
      background: #f8f9fa;
      border: 1px solid #dfe6e9;
      color: #2d3436;
    }

    .cancelButton:hover {
      background: #e9ecef;
    }

    .saveButton {
      background: #0984e3;
      border: none;
      color: white;
    }

    .saveButton:hover {
      background: #0770c9;
    }

    @media (max-width: 768px) {
      .modal {
        max-height: 100vh;
        border-radius: 0;
      }

      .checkboxGrid {
        grid-template-columns: 1fr;
      }
    }
    ```
  - **Acceptance Criteria:**
    - Modal is properly centered and accessible
    - Responsive design works on mobile
    - Buttons have clear hover states
  - **Validation:** Test modal on different screen sizes

#### 4.3 Integrate Config into FutureOutlook
- [ ] **Task:** Connect configuration panel to main component
  - **File:** `src/components/FutureOutlook/FutureOutlook.tsx` (UPDATE)
  - **Changes:**
    ```typescript
    // Add import
    import { MilestoneConfig } from './MilestoneConfig';

    // Replace placeholder config panel with:
    {showConfig && (
      <MilestoneConfig
        data={data}
        onUpdateMilestones={updateMilestones}
        onToggleMotivational={toggleMotivational}
        onClose={() => setShowConfig(false)}
      />
    )}
    ```
  - **Acceptance Criteria:**
    - Config modal opens when gear button clicked
    - Changes save correctly to localStorage
    - Modal closes on save or cancel
    - Milestone cards update immediately after save
  - **Validation:**
    - Toggle milestones on/off, verify cards appear/disappear
    - Toggle motivational message, verify tagline shows/hides
    - Refresh page, verify settings persisted

#### 4.4 Add Holiday Selection
- [ ] **Task:** Add holiday selection to config panel (includes both fixed and calculated holidays)
  - **File:** `src/components/FutureOutlook/MilestoneConfig.tsx` (UPDATE)
  - **Changes:**
    - Import holidays from `src/data/holidays.json`
    - Add state for selected holidays
    - Add new section in content:
    ```typescript
    <section className={styles.section}>
      <h4>Select Holidays</h4>
      <div className={styles.checkboxGrid}>
        {/* Show both fixed and calculated holidays */}
        {[...holidaysData.fixed, ...holidaysData.calculated].map(holiday => (
          <label key={holiday.id} className={styles.checkbox}>
            <input
              type="checkbox"
              checked={selectedHolidays.includes(holiday.id)}
              onChange={() => toggleHoliday(holiday.id)}
            />
            <span className={styles.checkboxLabel}>
              {holiday.name}
            </span>
          </label>
        ))}
      </div>
    </section>
    ```
    - Update handleSave to save holidays
  - **Acceptance Criteria:**
    - All holidays (fixed + calculated) load from holidays.json
    - Users can select/deselect any holiday
    - Selected holidays saved to localStorage
    - Both fixed (Christmas, New Year's) and calculated (Easter, Thanksgiving) holidays available
  - **Note:** ✅ Calculated holidays included per design decision. Custom user-entered holidays deferred to v2.1

#### 4.5 Implement Holiday Milestone Display
- [ ] **Task:** Show selected holidays as milestone cards
  - **File:** `src/hooks/useMilestones.ts` (UPDATE)
  - **Changes:**
    - Import `countHoliday` function
    - Load holidays.json
    - Add logic to calculate holiday milestones:
    ```typescript
    // After calculating standard milestones, add holidays
    const holidayMilestones = settings.selectedHolidays.map(holidayId => {
      const holiday = allHolidays.find(h => h.id === holidayId);
      if (!holiday) return null;

      const count = countHoliday(holiday, currentDate, lifeExpectancyDate);

      return {
        id: `holiday-${holidayId}`,
        type: 'holidays' as MilestoneType,
        label: holiday.name,
        icon: '🎉', // Generic icon, could be holiday-specific later
        count,
        description: `${count} more ${holiday.name} celebrations`,
      };
    }).filter(Boolean);

    return [...milestones, ...holidayMilestones];
    ```
  - **Acceptance Criteria:**
    - Holiday milestones appear as cards
    - Counts are accurate
    - Holidays respect user selection
  - **Validation:**
    - Select Christmas, verify card shows with correct count
    - Deselect, verify card disappears

---

## Phase 5: Integration & Polish

**Goal:** Integrate Future Outlook into main app and polish UX

### Tasks

#### 5.1 Integrate into App.tsx
- [ ] **Task:** Add FutureOutlook component to main app
  - **File:** `src/App.tsx` (UPDATE)
  - **Changes:**
    - Import FutureOutlook component
    - Calculate life expectancy date (may already exist)
    - Add component after TimeRemaining section:
    ```typescript
    import { FutureOutlook } from './components/FutureOutlook';

    // In JSX, after TimeRemaining:
    {userData && lifeExpectancyDate && (
      <FutureOutlook
        birthDate={userData.birthday}
        lifeExpectancyDate={lifeExpectancyDate}
      />
    )}
    ```
  - **Acceptance Criteria:**
    - FutureOutlook renders below existing clocks
    - Only shows when user data exists
    - Receives correct props from App state
  - **Validation:**
    - View full app, verify Future Outlook section appears
    - Check that milestones calculate correctly
    - Verify no console errors

#### 5.2 Handle Edge Case: User Exceeds Life Expectancy
- [ ] **Task:** Show appropriate message when user is older than expected
  - **File:** `src/components/FutureOutlook/FutureOutlook.tsx` (UPDATE)
  - **Changes:**
    - Check if user is beyond life expectancy
    - Show special message instead of cards:
    ```typescript
    const isOverExpectancy = new Date() > lifeExpectancyDate;

    if (isOverExpectancy) {
      return (
        <section className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Future Outlook</h2>
          </div>
          <div className={styles.specialMessage}>
            <p className={styles.celebrationText}>
              🎉 You're living beyond expectations! 🎉
            </p>
            <p className={styles.subText}>
              Every day is a gift. Make the most of it!
            </p>
          </div>
        </section>
      );
    }
    ```
  - **Acceptance Criteria:**
    - Special message shows for users over life expectancy
    - Tone is positive and celebratory
    - No milestone cards shown (counts would be negative/zero)
  - **Validation:** Temporarily set life expectancy in past, verify message shows

#### 5.3 Add Loading States
- [ ] **Task:** Handle loading and empty states gracefully
  - **File:** `src/components/FutureOutlook/FutureOutlook.tsx` (UPDATE)
  - **Changes:**
    - Add loading state if calculations in progress
    - Show helpful message if no milestones selected:
    ```typescript
    if (milestones.length === 0) {
      return (
        <section className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Future Outlook</h2>
            <button className={styles.configButton} onClick={() => setShowConfig(true)}>
              ⚙️
            </button>
          </div>
          <div className={styles.emptyState}>
            <p>No milestones selected.</p>
            <button onClick={() => setShowConfig(true)}>
              Configure Milestones
            </button>
          </div>
        </section>
      );
    }
    ```
  - **Acceptance Criteria:**
    - Empty state prompts user to configure
    - Button opens config panel
    - No broken UI if no milestones
  - **Validation:** Deselect all milestones, verify empty state shows

#### 5.4 Optimize Performance
- [ ] **Task:** Ensure no performance degradation
  - **Actions:**
    - Verify useMemo is used in useMilestones hook
    - Check that calculations don't run every render
    - Confirm clocks still run at 60fps
    - Profile component with React DevTools
  - **Acceptance Criteria:**
    - Time Lived/Remaining clocks unaffected
    - Future Outlook doesn't cause lag
    - No unnecessary re-renders
  - **Tools:** React DevTools Profiler
  - **Validation:** Record interaction, check render times

#### 5.5 Accessibility Improvements
- [ ] **Task:** Ensure Future Outlook is fully accessible
  - **Files:** All FutureOutlook components
  - **Checklist:**
    - [ ] All interactive elements keyboard accessible
    - [ ] Focus indicators visible on all buttons/inputs
    - [ ] Modal traps focus when open
    - [ ] ESC key closes config modal
    - [ ] ARIA labels on all icons/buttons
    - [ ] Screen reader announces milestone counts
    - [ ] Color contrast meets WCAG AA standards
  - **Acceptance Criteria:**
    - Can navigate entire feature with keyboard only
    - Screen reader properly announces all content
    - No accessibility warnings in browser console
  - **Tools:** axe DevTools, keyboard navigation testing
  - **Validation:** Test with screen reader (NVDA, VoiceOver, etc.)

#### 5.6 Mobile Responsiveness Final Check
- [ ] **Task:** Test and fix mobile layout issues
  - **Test Devices/Sizes:**
    - 320px (iPhone SE)
    - 375px (iPhone X)
    - 768px (iPad portrait)
    - 1024px (iPad landscape)
    - 1920px (Desktop)
  - **Checklist:**
    - [ ] Milestone cards size appropriately
    - [ ] Grid layout adjusts correctly
    - [ ] Config modal is usable on mobile
    - [ ] No horizontal scrolling
    - [ ] Touch targets are 44px minimum
    - [ ] Text is readable without zooming
  - **Acceptance Criteria:**
    - Feature works seamlessly on all screen sizes
    - No layout breaks or overlaps
    - Touch interactions are smooth
  - **Validation:** Use browser DevTools device emulation + real devices

---

## Phase 6: Testing & Documentation

**Goal:** Comprehensive testing and documentation

### Tasks

#### 6.1 Manual Testing - Happy Path
- [ ] **Task:** Test complete feature flow
  - **Test Scenarios:**
    1. New user: No milestones configured
       - Default milestones show (birthdays, summers, weekends)
       - Counts are accurate
    2. Configure milestones: Open config, change selections
       - Modal opens/closes correctly
       - Changes save and persist
       - Cards update immediately
    3. Add holidays: Select multiple holidays
       - Holiday cards appear
       - Counts are accurate
    4. Toggle motivational messages:
       - Tagline shows/hides correctly
    5. Refresh page:
       - All settings persist
       - Calculations remain accurate
  - **Acceptance Criteria:**
    - All scenarios pass without errors
    - User experience is smooth and intuitive
  - **Documentation:** Note any issues found in "Test Results" section below

#### 6.2 Manual Testing - Edge Cases
- [ ] **Task:** Test edge cases and error handling
  - **Test Scenarios:**
    1. User older than life expectancy
       - Special message shows
       - No negative counts
    2. Very young user (e.g., 2 years old)
       - Large counts display properly (1000+ weekends)
    3. No milestones selected
       - Empty state shows with helpful message
    4. Today is a milestone day (e.g., user's birthday)
       - Count is accurate (doesn't include today if already passed)
    5. Life expectancy very soon (e.g., 1 year)
       - Small counts display correctly
    6. Invalid date ranges
       - Graceful handling, no crashes
  - **Acceptance Criteria:**
    - All edge cases handled gracefully
    - No console errors or warnings
    - User-friendly error messages where applicable
  - **Documentation:** Note any issues in "Test Results" section

#### 6.3 Cross-Browser Testing
- [ ] **Task:** Test in all supported browsers
  - **Browsers to Test:**
    - Chrome (latest)
    - Firefox (latest)
    - Safari (latest)
    - Edge (latest)
    - Mobile Safari (iOS)
    - Chrome Android
  - **Test Checklist per Browser:**
    - [ ] Feature renders correctly
    - [ ] Calculations are accurate
    - [ ] Modal functions properly
    - [ ] LocalStorage works
    - [ ] No console errors
  - **Acceptance Criteria:**
    - Feature works in all supported browsers
    - No browser-specific bugs
  - **Documentation:** Note any browser-specific issues

#### 6.4 Performance Testing
- [ ] **Task:** Validate performance requirements
  - **Metrics to Check:**
    - Bundle size increase: < 30KB gzipped
    - Initial render time: < 100ms
    - Calculation time: < 50ms
    - No impact on clock performance (still 60fps)
  - **Tools:**
    - Chrome DevTools Performance tab
    - Lighthouse audit
    - Bundle analyzer (if available)
  - **Commands:**
    - `npm run build` - Check build output size
    - Lighthouse audit in Chrome DevTools
  - **Acceptance Criteria:**
    - All performance metrics within acceptable range
    - No performance regressions
  - **Documentation:** Record metrics in "Performance Results" section below

#### 6.5 Update CLAUDE.md
- [ ] **Task:** Document Future Outlook feature in project guide
  - **File:** `CLAUDE.md` (UPDATE)
  - **Sections to Add:**
    - Under "Key Files": List new files (types, utils, components, hooks)
    - Under "Component Hierarchy": Add FutureOutlook section
    - Under "State Management": Document FutureOutlookData storage
    - Under "Data Persistence": Document new localStorage key
    - New section: "Future Outlook System" with overview
  - **Example Addition:**
    ```markdown
    ### Future Outlook System
    - **Purpose**: Displays life milestones (birthdays, summers, weekends, holidays)
    - **Calculation**: Real-time counting of events between now and life expectancy
    - **Configuration**: User-selectable milestones and holidays
    - **Storage**: `lifeclock-future-outlook` localStorage key
    - **Key Files**:
      - `src/utils/milestoneCalculations.ts`: All calculation logic
      - `src/hooks/useMilestones.ts`: Real-time milestone hook
      - `src/components/FutureOutlook/`: All UI components
    ```
  - **Acceptance Criteria:**
    - Documentation is clear and concise
    - Future AI assistants can understand the system
    - Includes examples where helpful
  - **Validation:** Read through as if unfamiliar with feature

#### 6.6 Update README.md
- [ ] **Task:** Add Future Outlook to user-facing documentation
  - **File:** `README.md` (UPDATE)
  - **Sections to Add/Update:**
    - Features list: Add "Future Outlook" with brief description
    - Screenshot/demo section: Describe visual appearance
    - Usage instructions: How to configure milestones
  - **Example:**
    ```markdown
    ### Features
    - **Time Lived**: Real-time clock showing exact time alive
    - **Time Remaining**: Countdown based on life expectancy
    - **Life Timeline**: Visual representation of life progress
    - **Future Outlook**: 🎯 See how many birthdays, summers, weekends, and holidays you have left to make them count!
    - **Privacy-First**: All data stays on your device
    ```
  - **Acceptance Criteria:**
    - Users understand what Future Outlook does
    - Instructions are clear and actionable
  - **Validation:** Read as a new user, verify clarity

#### 6.7 Create Test Results Document
- [ ] **Task:** Document all test results
  - **File:** `TEST_RESULTS_FUTURE_OUTLOOK.md` (NEW FILE)
  - **Structure:**
    ```markdown
    # Future Outlook - Test Results

    **Test Date:** [Date]
    **Tester:** [Name/AI]
    **Version:** 2.0
    **Status:** [Pass/Fail]

    ## Test Summary
    - Total Tests: X
    - Passed: X
    - Failed: X
    - Skipped: X

    ## Happy Path Tests
    [Results from 6.1]

    ## Edge Case Tests
    [Results from 6.2]

    ## Cross-Browser Tests
    [Results from 6.3]

    ## Performance Tests
    [Results from 6.4]

    ## Issues Found
    [List any bugs or issues discovered]

    ## Recommendations
    [Suggestions for improvements]
    ```
  - **Acceptance Criteria:**
    - All test results documented
    - Issues clearly described with reproduction steps
    - Status is clear (pass/fail/blocked)

---

## Phase 7: Deployment & Cleanup (Optional)

**Goal:** Prepare for deployment and clean up

### Tasks

#### 7.1 Final Build Test
- [ ] **Task:** Verify production build works
  - **Commands:**
    ```bash
    npm run build
    npm run preview
    ```
  - **Acceptance Criteria:**
    - Build completes without errors
    - Preview works correctly
    - Future Outlook functions in production build
  - **Validation:** Test all features in preview mode

#### 7.2 Clean Up Test Files
- [ ] **Task:** Remove or gitignore test files
  - **Files to Handle:**
    - `test-milestones.mjs` (delete or keep in .gitignore)
    - Any other temporary test files
  - **Acceptance Criteria:**
    - No test files committed to git
    - .gitignore updated if needed
  - **Command:** `git status` to verify clean working tree

#### 7.3 Create Pull Request
- [ ] **Task:** Prepare feature for review and merge
  - **Prerequisites:**
    - All tests passing
    - Documentation updated
    - Code reviewed (self-review or peer review)
  - **Actions:**
    1. Commit all changes
    2. Push branch to remote
    3. Create PR with detailed description
  - **PR Description Template:**
    ```markdown
    ## Feature: Future Outlook

    Adds life milestone tracking to help users visualize finite time.

    ### What's New
    - Milestone cards showing birthdays, seasons, weekends, holidays remaining
    - Configuration panel to customize tracked milestones
    - Holiday selection (Christmas, Thanksgiving, etc.)
    - Motivational messaging to inspire action

    ### Implementation Details
    - New `FutureOutlook` component with configuration system
    - Calculation utilities for seasons, birthdays, weekends, holidays
    - localStorage integration for user preferences
    - Fully responsive and accessible

    ### Testing
    - Manual testing completed (see TEST_RESULTS_FUTURE_OUTLOOK.md)
    - Cross-browser testing: Chrome, Firefox, Safari, Edge
    - Mobile testing: iOS and Android
    - Performance validated: <30KB bundle increase

    ### Screenshots
    [Add screenshots if available]

    ### Related Documents
    - PRD: PRD_FUTURE_OUTLOOK.md
    - Implementation Plan: IMPLEMENTATION_FUTURE_OUTLOOK.md

    ### Checklist
    - [x] All tasks completed
    - [x] Tests passing
    - [x] Documentation updated
    - [x] No console errors
    - [x] Accessibility tested
    - [x] Performance optimized
    ```
  - **Acceptance Criteria:**
    - PR created with comprehensive description
    - All CI checks passing (if applicable)
    - Ready for review/merge

---

## Completion Checklist

**Before marking the feature as DONE, verify:**

- [ ] All Phase 0-6 tasks completed
- [ ] Feature works end-to-end without errors
- [ ] User data persists correctly
- [ ] Mobile responsive design validated
- [ ] Accessibility requirements met
- [ ] Performance requirements met
- [ ] Documentation updated (CLAUDE.md, README.md)
- [ ] Test results documented
- [ ] Code is clean and well-commented
- [ ] No console errors or warnings
- [ ] Production build tested

---

## Test Results

### Phase 2 Calculation Tests

**Test Date:** _[To be filled by implementer]_

**Birthdays:**
- Test case: _[Results]_
- Edge cases: _[Results]_

**Seasons:**
- Summer: _[Results]_
- Winter: _[Results]_
- Spring: _[Results]_
- Fall: _[Results]_

**Weekends:**
- Test case: _[Results]_

**Holidays:**
- Christmas: _[Results]_
- Easter: _[Results]_
- Thanksgiving: _[Results]_

### Phase 6 Manual Tests

_[To be filled during Phase 6 testing]_

---

## Performance Results

**Bundle Size:**
- Before: _[KB gzipped]_
- After: _[KB gzipped]_
- Increase: _[KB gzipped]_

**Lighthouse Scores:**
- Performance: _[Score]_
- Accessibility: _[Score]_
- Best Practices: _[Score]_
- SEO: _[Score]_

**Calculation Performance:**
- Initial calculation time: _[ms]_
- Recalculation time: _[ms]_

---

## Known Issues / Future Enhancements

**Issues:**
_[List any known bugs or limitations]_

**Future Enhancements:**
- Custom holiday dates (user-entered)
- Hemisphere-specific seasons
- Historical comparison view (lived vs. remaining)
- Animated counter transitions
- More calculated holidays (Eid, Diwali, Lunar New Year, etc.)
- Export milestone data
- Milestone notifications

---

## Implementation Notes

**Date Started:** 2026-01-12
**Date Completed:** _[To be filled]_
**Total Time:** _[To be calculated]_

**Implemented By:**
- Phase 0: _[AI/Human]_
- Phase 1: _[AI/Human]_
- Phase 2: _[AI/Human]_
- Phase 3: _[AI/Human]_
- Phase 4: _[AI/Human]_
- Phase 5: _[AI/Human]_
- Phase 6: _[AI/Human]_

**Deviations from Plan:**
- 2026-01-12: All design decisions finalized (see "Finalized Design Decisions" section)
- Calculated holidays (Easter, Thanksgiving) confirmed for v1.0 (was ambiguous in initial draft)
- Custom user-entered holidays explicitly deferred to v2.1
- Hemisphere detection explicitly deferred to v2.1
- Timeline integration explicitly deferred to v2.0
_[Additional deviations to be noted during implementation]_

**Lessons Learned:**
_[Document insights for future features]_

---

## Quick Reference

### File Structure Created
```
src/
├── types/
│   └── milestones.ts
├── data/
│   └── holidays.json
├── utils/
│   ├── milestoneCalculations.ts
│   └── holidayCalculations.ts
├── hooks/
│   ├── useMilestones.ts
│   └── useFutureOutlookStorage.ts
└── components/
    └── FutureOutlook/
        ├── index.ts
        ├── FutureOutlook.tsx
        ├── FutureOutlook.module.css
        ├── MilestoneCard.tsx
        ├── MilestoneCard.module.css
        ├── MilestoneConfig.tsx
        └── MilestoneConfig.module.css
```

### Key Commands
```bash
# Development
npm run dev

# Type checking
npx tsc -b

# Build production
npm run build

# Preview production build
npm run preview

# Test (manual)
node test-milestones.mjs
```

### LocalStorage Keys
- `lifeclock-user-data` - Existing user data
- `lifeclock-future-outlook` - Future Outlook preferences

---

**Last Updated:** 2026-01-12 by Claude Sonnet 4.5
**Status:** Ready for Implementation
