# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LifeClock is a privacy-first web application that visualizes life in real-time, displaying time lived and statistical time remaining. Built with React 18 + TypeScript + Vite, using date-fns for calculations. All data stays local (localStorage only).

## Common Commands

```bash
# Development
npm run dev           # Start dev server (http://localhost:5173)
npm run build         # TypeScript check + production build
npm run preview       # Preview production build
npm run lint          # Run ESLint

# Type checking only
npx tsc -b            # Check types without building
```

## Architecture

### Data Flow
1. **Storage Layer**: `useLocalStorage` hook syncs `StoredUserData` (ISO strings) with localStorage
2. **State Layer**: `App.tsx` converts stored data to `UserData` (Date objects) for React state
3. **Calculation Layer**: Custom hooks compute real-time values:
   - `useLifeExpectancy`: Looks up life expectancy from WHO data (`src/data/lifeExpectancy.json`)
   - `useTimeDifference`: Updates every second, calculates time lived/remaining
4. **Display Layer**: Components render clocks and timeline visualization

### Key Files
- `src/App.tsx`: Main orchestrator, manages data flow between storage/hooks/components
- `src/types/index.ts`: All TypeScript interfaces (UserData, StoredUserData, TimeLived, TimelineUnit, ThemeConfig, etc.)
- `src/types/milestones.ts`: Future Outlook type definitions (Milestone, HolidayDefinition, FutureOutlookData)
- `src/hooks/useLocalStorage.ts`: Generic localStorage sync hook with cross-tab sync
- `src/hooks/useTimeDifference.ts`: Real-time time calculations (updates every second)
- `src/hooks/useLifeExpectancy.ts`: Life expectancy lookup hook
- `src/hooks/useMilestones.ts`: Real-time milestone calculations hook
- `src/hooks/useFutureOutlookStorage.ts`: Future Outlook preferences storage hook
- `src/hooks/useTheme.ts`: Theme management hook
- `src/utils/timeCalculations.ts`: Core date math (calculateTimeDifference, isOverLifeExpectancy)
- `src/utils/milestoneCalculations.ts`: All milestone calculation logic (birthdays, seasons, weekends, holidays)
- `src/utils/holidayCalculations.ts`: Holiday date calculation algorithms (Easter, Thanksgiving)
- `src/utils/lifeExpectancyCalculator.ts`: Looks up country/gender life expectancy with fallback
- `src/utils/timelineCalculations.ts`: Timeline grid calculations (years/months/weeks granularity)
- `src/components/LifeTimeline.tsx`: Main timeline component coordinating grid layout
- `src/components/FutureOutlook/`: Future Outlook components (FutureOutlook, MilestoneCard, MilestoneConfig)
- `src/components/Settings.tsx`: Settings modal for profile editing and theme selection
- `src/config/themes.ts`: Theme definitions (8 color schemes)
- `src/data/lifeExpectancy.json`: WHO life expectancy data (100+ countries)
- `src/data/holidays.json`: Holiday definitions (fixed and calculated dates)

### Component Hierarchy
```
App
├── UserInputForm (initial setup or edit mode)
├── [Main View]
│   ├── TimeLived (wraps ClockDisplay)
│   ├── TimeRemaining (wraps ClockDisplay)
│   ├── FutureOutlook
│   │   ├── MilestoneCard (repeated for each milestone)
│   │   └── MilestoneConfig (modal, conditional)
│   └── LifeTimeline
│       └── TimelineGrid
│           └── TimelineIcon (repeated for each unit)
└── Settings (modal, conditional)
```

### State Management
- **No Redux**: Uses React hooks exclusively
- **Single Source of Truth**: localStorage → storedData → userData → derived calculations
- **Real-time Updates**: `useTimeDifference` runs `setInterval` every 1000ms
- **Cross-tab Sync**: `useLocalStorage` listens to storage events for multi-tab consistency

### Data Persistence
- **Storage Keys**:
  - `'lifeclock-user-data'`: User profile data (birthday, country, gender)
  - `'lifeclock-future-outlook'`: Future Outlook preferences (selected milestones, holidays)
  - `'lifeclock-theme'`: Current theme selection (ThemeName)
  - `'lifeclock-timeline-granularity'`: Timeline view mode (years/months/weeks)
  - `'lifeclock-timeline-icon-style'`: Timeline icon style (squares/circles/unicode/rounded-rect)
- **Format**: JSON with ISO strings for dates (`birthday`, `lastUpdated`)
- **Privacy**: No backend, no analytics, no external requests
- **Cross-tab Sync**: All localStorage changes sync across tabs via storage events

## Development Notes

### Theme System
- **8 Built-in Themes**: Ocean Sunset (default), Neon Dreams, Forest Fire, Cyber Glow, Grape Punch, Sunset Glow, Electric Storm, Tropical Vibes
- **Theme Application**: `useTheme` hook sets `data-theme` attribute on `document.documentElement`
- **CSS Variables**: Each theme defines `--lived-primary` and `--remaining-primary` color values
- **Settings Modal**: Accessible via header gear icon, allows profile editing and theme selection
- **Live Preview**: Hover over theme cards in Settings to preview before applying
- **Theme Config**: Define new themes in `src/config/themes.ts` with `ThemeConfig` interface

### Adding Themes
Add to `src/config/themes.ts`:
```typescript
'theme-name': {
  name: 'theme-name',
  displayName: 'Display Name',
  description: 'Brief description',
  livedPrimary: '#hex-color',    // Color for time lived
  remainingPrimary: '#hex-color', // Color for time remaining
}
```
Then add corresponding CSS in `App.css` under `[data-theme="theme-name"]`.

### Adding Countries
Edit `src/data/lifeExpectancy.json` with WHO data:
```json
{
  "XXX": {
    "countryName": "Country Name",
    "male": 75.5,
    "female": 80.2,
    "both": 77.8
  }
}
```

### Timeline System
- **Granularities**: years, months, weeks (configurable via `TimelineGranularity` type)
- **Layouts**:
  - Years: 10 columns (each row = decade)
  - Months: 12 columns (each row = year)
  - Weeks: 52 columns (each row = year)
- **States**: Each unit can be `isLived`, `isCurrent`, or future
- **Calculations**: `src/utils/timelineCalculations.ts` handles all grid math

### Future Outlook System
- **Purpose**: Displays life milestones (birthdays, summers, weekends, holidays remaining)
- **Default Milestones**: Birthdays, Summers, Weekends (user can customize)
- **Calculation**: Real-time counting of events between current date and life expectancy
- **Configuration**: User-selectable milestones and holidays via modal interface
- **Storage**: `lifeclock-future-outlook` localStorage key for preferences
- **Milestone Types**:
  - **Seasons**: Summer, Winter, Spring, Fall (Northern Hemisphere dates)
  - **Birthdays**: Annual birthday occurrences
  - **Weekends**: Saturday-Sunday pairs
  - **Holidays**: Fixed dates (Christmas, New Year's) and calculated (Easter, Thanksgiving)
- **Holiday Calculations**:
  - Fixed holidays: Simple MM/DD date matching
  - Calculated holidays: Easter (Meeus/Jones/Butcher algorithm), Thanksgiving (4th Thursday of November)
- **Key Files**:
  - `src/utils/milestoneCalculations.ts`: Core calculation logic
  - `src/utils/holidayCalculations.ts`: Holiday date algorithms
  - `src/hooks/useMilestones.ts`: Real-time milestone updates (checks every minute for date changes)
  - `src/components/FutureOutlook/`: All UI components
- **Edge Cases**:
  - Users over life expectancy: Shows "Living beyond expectations!" message
  - No milestones selected: Shows empty state with configuration prompt
  - Partial periods: If currently in a season/event, counts it as 1

### Edge Cases Handled
- Users older than life expectancy show "Living beyond expectations!" message
- Missing country data falls back to global average (73 years)
- Leap years handled by date-fns
- Future birthdays prevented by form validation
- SSR safety checks in useLocalStorage (`typeof window`)
- Cross-tab synchronization via storage events

## Dependencies
- **react**: 18.3.1 (UI framework)
- **react-dom**: 18.3.1 (DOM rendering)
- **date-fns**: 4.1.0 (date calculations)

Keep bundle small - avoid adding heavy libraries.
