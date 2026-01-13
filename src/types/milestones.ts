/**
 * milestones.ts
 *
 * Purpose: Type definitions for Future Outlook feature
 * Phase: Phase 1.1 - Core Infrastructure
 * Dependencies: None
 * Used by: All milestone-related components, hooks, and utilities
 */

// Milestone type enumeration
export type MilestoneType =
  | 'birthdays'
  | 'summers'
  | 'winters'
  | 'spring'
  | 'fall'
  | 'weekends'
  | 'holidays';

/**
 * Calculated milestone with count
 */
export interface Milestone {
  id: string;              // Unique identifier
  type: MilestoneType;     // Type of milestone
  label: string;           // Display label (e.g., "Birthdays", "Summers")
  icon: string;            // Icon/emoji to display
  count: number;           // Number of occurrences remaining
  description: string;     // Tooltip/explanation text
}

// Holiday definition types
export type HolidayType = 'fixed' | 'calculated' | 'custom';

/**
 * Holiday definition from holidays.json
 */
export interface HolidayDefinition {
  id: string;              // Unique identifier (e.g., "christmas")
  name: string;            // Display name (e.g., "Christmas")
  icon: string;            // Icon/emoji to display
  type: HolidayType;       // Fixed date, calculated, or custom
  date?: string;           // MM/DD for fixed dates (optional)
  calculateFn?: string;    // Function name for calculated holidays (optional)
}

/**
 * Custom holiday (user-created)
 * Note: Custom holidays deferred to v2.1
 */
export interface CustomHoliday {
  id: string;              // Unique identifier
  name: string;            // Display name
  date: string;            // MM/DD for annual, MM/DD/YYYY for one-time
  isAnnual: boolean;       // Whether it recurs annually
}

/**
 * User preferences for Future Outlook
 * Stored in localStorage: 'lifeclock-future-outlook'
 */
export interface FutureOutlookData {
  selectedMilestones: string[];     // Array of milestone type IDs
  selectedHolidays: string[];       // Array of holiday IDs
  customHolidays: CustomHoliday[];  // User-created holidays (v2.1)
  showMotivational: boolean;        // Show motivational tagline
  viewMode: 'remaining' | 'comparison';  // Display mode (v2.0 for comparison)
  lastUpdated: string;              // ISO 8601 timestamp
}

/**
 * Input for milestone calculation
 */
export interface MilestoneCalculationInput {
  currentDate: Date;           // Current date/time
  birthDate: Date;             // User's birth date
  lifeExpectancyDate: Date;    // Expected death date
  type: MilestoneType;         // Type of milestone to calculate
  holidayDate?: Date;          // For specific holiday calculations
}
