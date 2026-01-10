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
- `src/types/index.ts`: All TypeScript interfaces (UserData, StoredUserData, TimeLived, TimelineUnit, etc.)
- `src/hooks/useLocalStorage.ts`: Generic localStorage sync hook with cross-tab sync
- `src/utils/timeCalculations.ts`: Core date math (calculateTimeDifference, isOverLifeExpectancy)
- `src/utils/lifeExpectancyCalculator.ts`: Looks up country/gender life expectancy with fallback
- `src/components/LifeTimeline.tsx`: Main timeline component coordinating grid layout
- `src/utils/timelineCalculations.ts`: Timeline grid calculations (years/months/weeks granularity)

### Component Hierarchy
```
App
├── UserInputForm (initial setup or edit mode)
└── [Main View]
    ├── TimeLived (wraps ClockDisplay)
    ├── TimeRemaining (wraps ClockDisplay)
    └── LifeTimeline
        └── TimelineGrid
            └── TimelineIcon (repeated for each unit)
```

### State Management
- **No Redux**: Uses React hooks exclusively
- **Single Source of Truth**: localStorage → storedData → userData → derived calculations
- **Real-time Updates**: `useTimeDifference` runs `setInterval` every 1000ms
- **Cross-tab Sync**: `useLocalStorage` listens to storage events for multi-tab consistency

### Data Persistence
- **Storage Key**: `'lifeclock-user-data'`
- **Format**: JSON with ISO strings (`birthday`, `lastUpdated`)
- **Privacy**: No backend, no analytics, no external requests

## Development Notes

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
