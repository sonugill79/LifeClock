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
  gender: 'male' | 'female' | 'other' | null;
  country: string | null;
  incomePercentile?: number; // Optional: 1-100, US only
}

export interface StoredUserData {
  birthday: string; // ISO string
  gender: 'male' | 'female' | 'other';
  country: string; // ISO country code
  incomePercentile?: number; // Optional: 1-100, US only
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

// Income-based life expectancy types
export interface IncomeLifeExpectancyEntry {
  gnd: 'M' | 'F';              // Gender code
  pctile: number;              // Income percentile (1-100)
  count: number;               // Population count
  hh_inc: number;              // Household income
  hh_inc_age40: number;        // Household income at age 40
  le_agg: number;              // Life expectancy (PRIMARY VALUE)
  le_raceadj: number;          // Race-adjusted life expectancy
  sd_le_agg: number;           // Standard deviation of life expectancy
  sd_le_raceadj: number;       // Standard deviation of race-adjusted LE
}

export interface LifeExpectancyResult {
  years: number;
  source: LifeExpectancySource;
}

export interface LifeExpectancySource {
  type: 'country' | 'income';
  dataSource: string;          // "WHO" or "Health Inequality Project"
  description: string;         // Human-readable description
  details?: {
    country?: string;
    incomePercentile?: number;
    gender?: string;
  };
}
