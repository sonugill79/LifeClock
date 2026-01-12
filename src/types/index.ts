export interface TimeLived {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export interface UserData {
  birthday: Date | null;
  gender: 'male' | 'female' | null;
  country: string | null;
}

export interface StoredUserData {
  birthday: string; // ISO string
  gender: 'male' | 'female';
  country: string; // ISO country code
  lastUpdated: string; // ISO string
}

export interface LifeExpectancyEntry {
  countryName: string;
  male: number;
  female: number;
  both: number;
}

export type LifeExpectancyData = {
  [countryCode: string]: LifeExpectancyEntry;
};

// Timeline granularity options
export type TimelineGranularity = 'years' | 'months' | 'weeks';

// Icon style options for visual comparison
export type IconStyle = 'squares' | 'circles' | 'unicode' | 'rounded-rect';

// Data structure for each timeline unit
export interface TimelineUnit {
  index: number;           // Sequential index (0-based)
  isLived: boolean;        // Whether this unit has been lived
  isCurrent: boolean;      // Whether this is the current unit
  isPreBirth: boolean;     // Whether this unit is before birth (for calendar-aligned view)
  label: string;           // Display label (e.g., "Jan 2020")
  detailsText: string;     // Full tooltip text
  age: number;             // Age at this unit
}

// Grid layout configuration
export interface GridLayout {
  rows: number;
  columns: number;
  totalUnits: number;
  livedUnits: number;
  remainingUnits: number;
  currentUnit: number;     // Which unit we're currently in
  percentComplete: number; // Percentage of life lived
  actualYears?: number;    // For years view: actual years lived (not blocks)
  actualTotalYears?: number; // For years view: actual total years
}

// Timeline calculation result
export interface TimelineData {
  layout: GridLayout;
  units: TimelineUnit[];
}

// Theme system
export type ThemeName = 'ocean-sunset' | 'neon-dreams' | 'forest-fire' | 'cyber-glow' | 'grape-punch' | 'sunset-glow' | 'electric-storm' | 'tropical-vibes';

export interface ThemeConfig {
  name: ThemeName;
  displayName: string;
  description: string;
  livedPrimary: string;
  remainingPrimary: string;
}
