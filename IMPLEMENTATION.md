# LifeClock - Implementation Plan

**Project:** LifeClock
**Started:** 2026-01-09
**Status:** In Progress
**Current Phase:** Core Setup & Foundation

---

## Quick Start (For AI Resuming)

To continue this project:
1. Current working directory: `/home/sonu/CodeProjects/LifeClock`
2. Read this file completely to understand progress
3. Check the todo list for current task
4. Review PRD.md for requirements
5. Continue from "Current Status" section below

---

## Project Structure (Planned vs Actual)

### Completed Structure ✓
```
/home/sonu/CodeProjects/LifeClock/
├── .claude/                     ✓ Claude settings
├── .gitignore                   ✓ Git ignore file
├── package.json                 ✓ Dependencies configured
├── tsconfig.json                ✓ TypeScript config (project references)
├── tsconfig.app.json            ✓ App-specific TS config
├── tsconfig.node.json           ✓ Node-specific TS config
├── vite.config.ts               ✓ Vite configuration
├── index.html                   ✓ Entry HTML
├── PRD.md                       ✓ Product Requirements Doc
├── IMPLEMENTATION.md            ✓ This file
├── node_modules/                ✓ Dependencies installed (222 packages)
└── src/
    ├── types/
    │   └── index.ts             ✓ TypeScript interfaces
    └── data/
        └── lifeExpectancy.json  ✓ 100 countries with life expectancy data
```

### Pending Structure ⏳
```
src/
├── main.tsx                     ⏳ React entry point
├── App.tsx                      ⏳ Main app component
├── App.css                      ⏳ Main styles
├── utils/
│   ├── timeCalculations.ts     ⏳ Core calculation logic
│   └── lifeExpectancyCalculator.ts ⏳ Life expectancy lookup
├── hooks/
│   ├── useTimeDifference.ts    ⏳ Time diff hook
│   ├── useLocalStorage.ts      ⏳ Storage persistence hook
│   └── useLifeExpectancy.ts    ⏳ Life expectancy data hook
├── components/
│   ├── UserInputForm.tsx       ⏳ Birthday/gender/country form
│   ├── ClockDisplay.tsx        ⏳ Reusable clock component
│   ├── TimeLived.tsx           ⏳ Time lived wrapper
│   └── TimeRemaining.tsx       ⏳ Time remaining wrapper
└── styles/
    └── (component CSS files)   ⏳ Component-specific styles
```

---

## Completed Tasks ✓

### 1. Project Initialization ✓
- ✓ Created package.json with all dependencies (React 18.3.1, date-fns 4.1.0, Vite 6.0.5)
- ✓ Configured TypeScript with strict mode
- ✓ Set up Vite build configuration
- ✓ Created index.html entry point
- ✓ Added .gitignore for Node.js projects
- ✓ Installed all 222 npm packages (0 vulnerabilities)

**Files Created:**
- `/home/sonu/CodeProjects/LifeClock/package.json`
- `/home/sonu/CodeProjects/LifeClock/tsconfig.json`
- `/home/sonu/CodeProjects/LifeClock/tsconfig.app.json`
- `/home/sonu/CodeProjects/LifeClock/tsconfig.node.json`
- `/home/sonu/CodeProjects/LifeClock/vite.config.ts`
- `/home/sonu/CodeProjects/LifeClock/index.html`
- `/home/sonu/CodeProjects/LifeClock/.gitignore`

### 2. TypeScript Type Definitions ✓
- ✓ Created comprehensive interfaces for all data structures
- ✓ TimeLived interface (years, months, days, hours, minutes, seconds, totalSeconds)
- ✓ UserData interface (birthday, gender, country)
- ✓ StoredUserData interface (for localStorage)
- ✓ LifeExpectancyEntry interface (countryName, male, female, both)
- ✓ LifeExpectancyData type (mapped type for country lookup)

**Files Created:**
- `/home/sonu/CodeProjects/LifeClock/src/types/index.ts` (37 lines)

### 3. Life Expectancy Data ✓
- ✓ Created JSON file with 100 countries
- ✓ Data includes WHO 2023 life expectancy values
- ✓ Each entry has male, female, and combined values
- ✓ Covers major countries from all continents
- ✓ Uses ISO 3166-1 alpha-3 country codes

**Files Created:**
- `/home/sonu/CodeProjects/LifeClock/src/data/lifeExpectancy.json` (100 entries)

**Sample Data:**
```json
{
  "USA": { "countryName": "United States", "male": 74.5, "female": 80.2, "both": 77.3 },
  "JPN": { "countryName": "Japan", "male": 81.5, "female": 87.6, "both": 84.5 },
  "IND": { "countryName": "India", "male": 69.5, "female": 72.0, "both": 70.8 }
}
```

### 4. Documentation ✓
- ✓ Created comprehensive PRD (Product Requirements Document)
- ✓ Created detailed Implementation Plan (this file)
- ✓ Documented all decisions, requirements, and edge cases

**Files Created:**
- `/home/sonu/CodeProjects/LifeClock/PRD.md`
- `/home/sonu/CodeProjects/LifeClock/IMPLEMENTATION.md`

---

## Current Status

**Active Task:** Setting up project folder structure
**Next Task:** Build core calculation logic (timeCalculations.ts)

**Todo List Status:**
1. ✓ Initialize Vite + React + TypeScript project
2. ✓ Install date-fns dependency
3. ⏳ Set up project folder structure (IN PROGRESS)
4. ⏳ Create TypeScript interfaces (COMPLETED but task not marked off)
5. ⏳ Create life expectancy data JSON file (COMPLETED but task not marked off)
6. ⏳ Build core calculation logic (timeCalculations.ts)
7. ⏳ Create custom hooks
8. ⏳ Build UserInputForm component
9. ⏳ Build ClockDisplay component
10. ⏳ Build TimeLived and TimeRemaining components
11. ⏳ Integrate components in App.tsx
12. ⏳ Add styling and responsive design
13. ⏳ Test the application

---

## Next Steps (For AI Continuing)

### Immediate Next Steps (In Order)

#### Step 1: Complete Folder Structure ⏳
Create remaining src/ directories:
```bash
mkdir -p src/utils src/hooks src/components src/styles
```

#### Step 2: Build Core Calculation Logic ⏳
**File:** `src/utils/timeCalculations.ts`

**Purpose:** Core date math for calculating time lived and remaining

**Key Functions to Implement:**
```typescript
export function calculateTimeLived(
  birthday: Date,
  currentTime: Date
): TimeLived {
  // Use date-fns functions:
  // - differenceInYears
  // - differenceInMonths
  // - differenceInDays
  // - Get remaining hours, minutes, seconds
  // Return TimeLived object
}

export function calculateTimeRemaining(
  birthday: Date,
  lifeExpectancyYears: number,
  currentTime: Date
): TimeLived {
  // Calculate expected death date
  // If past expectancy, return zeros or special handling
  // Otherwise calculate difference
  // Return TimeLived object
}
```

**Dependencies:** `date-fns` functions
- `differenceInYears`
- `differenceInMonths`
- `differenceInDays`
- `addYears`
- `addMonths`

**Edge Cases to Handle:**
- User older than life expectancy (return zeros or bonus time)
- Leap years (date-fns handles this automatically)
- Negative time (validation should prevent, but handle gracefully)

#### Step 3: Build Life Expectancy Calculator ⏳
**File:** `src/utils/lifeExpectancyCalculator.ts`

**Purpose:** Look up life expectancy from JSON data

**Key Functions:**
```typescript
import lifeExpectancyData from '../data/lifeExpectancy.json';

export function getLifeExpectancy(
  country: string,
  gender: 'male' | 'female'
): number {
  // Load JSON data
  // Lookup country by code
  // Return gender-specific value
  // Fallback to 'both' if needed
  // Default to 73 if country not found
}

export function getCountryList(): Array<{ code: string; name: string }> {
  // Parse JSON into sorted array of countries
  // For dropdown population
}
```

#### Step 4: Create Custom Hooks ⏳

**File 1:** `src/hooks/useLocalStorage.ts`
```typescript
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // useState initialized from localStorage
  // Save to localStorage on value change
  // Handle JSON parse/stringify
  // Handle errors gracefully
}
```

**File 2:** `src/hooks/useLifeExpectancy.ts`
```typescript
export function useLifeExpectancy(
  country: string | null,
  gender: 'male' | 'female' | null
): number | null {
  // Call getLifeExpectancy utility
  // Return null if inputs are null
  // Memoize with useMemo
}
```

**File 3:** `src/hooks/useTimeDifference.ts`
```typescript
export function useTimeDifference(
  birthday: Date | null,
  lifeExpectancy: number | null
): {
  timeLived: TimeLived | null;
  timeRemaining: TimeLived | null;
  currentTime: Date;
} {
  // useState for currentTime
  // useEffect to set up 1-second interval
  // useMemo for timeLived calculation
  // useMemo for timeRemaining calculation
  // Clean up interval on unmount
}
```

#### Step 5: Build React Components ⏳

**Component 1:** `src/components/UserInputForm.tsx`
```typescript
interface UserInputFormProps {
  onSubmit: (data: UserData) => void;
  initialData?: UserData;
}

// Features:
// - Date input for birthday (HTML5 date picker)
// - Radio buttons for gender
// - Searchable dropdown for country (datalist or select)
// - Validation (no future dates, all fields required)
// - Submit button
// - Clear, accessible labels
```

**Component 2:** `src/components/ClockDisplay.tsx`
```typescript
interface ClockDisplayProps {
  time: TimeLived;
  label: string;
  color: 'blue' | 'orange';
}

// Features:
// - Display time breakdown (years, months, days, H:M:S)
// - Large, readable fonts
// - Color-coded background/border
// - Responsive sizing
// - React.memo for performance
```

**Component 3:** `src/components/TimeLived.tsx`
```typescript
interface TimeLivedProps {
  time: TimeLived | null;
}

// Wrapper around ClockDisplay with:
// - "Time Lived" label
// - Blue/green color scheme
// - Appropriate ARIA labels
```

**Component 4:** `src/components/TimeRemaining.tsx`
```typescript
interface TimeRemainingProps {
  time: TimeLived | null;
  isOverExpectancy?: boolean;
}

// Wrapper around ClockDisplay with:
// - "Time Remaining" label
// - Orange/purple color scheme
// - Special message if over expectancy
```

#### Step 6: Build Main App Component ⏳
**File:** `src/App.tsx`

```typescript
// State:
// - userData: UserData (from useLocalStorage)
// - currentTime, timeLived, timeRemaining (from useTimeDifference)
// - lifeExpectancy (from useLifeExpectancy)
// - isEditing: boolean (toggle between form and clocks)

// Logic:
// - Load userData from localStorage on mount
// - Show UserInputForm if no userData or isEditing
// - Show clocks if userData exists and not editing
// - Provide "Edit Details" button when clocks visible

// Layout:
// - Header with title/tagline
// - Conditional render: Form OR Clocks
// - Two-column clock layout (flex/grid)
// - Edit button below clocks
```

#### Step 7: Create Entry Point ⏳
**File:** `src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### Step 8: Add Styling ⏳
**File:** `src/App.css`

**Key Styles:**
- Mobile-first responsive design
- CSS Grid/Flexbox for layout
- Two-column on desktop (media query > 768px)
- Stacked on mobile
- Large font sizes for clock numbers (48px+)
- Color scheme implementation
- Smooth transitions
- Accessibility (focus states, high contrast)

#### Step 9: Test & Debug ⏳
1. Run dev server: `npm run dev`
2. Test in browser (localhost:5173)
3. Verify calculations are accurate
4. Test edge cases:
   - Future birthday (should be blocked)
   - Old birthday (leap years)
   - User over life expectancy
   - LocalStorage persistence
   - Browser refresh
5. Test responsive design (mobile/desktop)
6. Check console for errors
7. Verify TypeScript builds: `npm run build`

#### Step 10: Build & Deploy ⏳
1. Production build: `npm run build`
2. Test build: `npm run preview`
3. Deploy to Vercel/Netlify
4. Verify production works
5. Share URL with user

---

## Implementation Guidelines

### Code Quality Standards
- **TypeScript Strict Mode:** All code must pass strict type checking
- **ESLint:** No errors, warnings should be addressed
- **Performance:** Memoize expensive calculations with useMemo
- **Accessibility:** ARIA labels, semantic HTML, keyboard navigation
- **Error Handling:** Try/catch for JSON parsing, localStorage access

### Testing Checklist
- [ ] Calculations accurate to the second
- [ ] Leap years handled correctly
- [ ] Life expectancy lookup works for all countries
- [ ] LocalStorage saves/loads correctly
- [ ] Form validation prevents invalid input
- [ ] Clocks update smoothly (60fps)
- [ ] Responsive design works on mobile
- [ ] Works in Chrome, Firefox, Safari
- [ ] No console errors or warnings
- [ ] TypeScript builds without errors

### Performance Targets
- Bundle size: < 200KB gzipped
- Initial load: < 2 seconds on 3G
- Time-to-interactive: < 3 seconds
- Clock updates: 60fps (no jank)

---

## Key Files Reference

### Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript project config
- `vite.config.ts` - Vite build config
- `index.html` - HTML entry point

### Source Files (Priority Order)
1. `src/types/index.ts` - Type definitions ✓
2. `src/data/lifeExpectancy.json` - Life expectancy data ✓
3. `src/utils/timeCalculations.ts` - Core logic ⏳ NEXT
4. `src/utils/lifeExpectancyCalculator.ts` - Data lookup ⏳
5. `src/hooks/useLocalStorage.ts` - Storage hook ⏳
6. `src/hooks/useLifeExpectancy.ts` - Life expectancy hook ⏳
7. `src/hooks/useTimeDifference.ts` - Time calculation hook ⏳
8. `src/components/ClockDisplay.tsx` - Reusable clock ⏳
9. `src/components/UserInputForm.tsx` - Input form ⏳
10. `src/components/TimeLived.tsx` - Time lived display ⏳
11. `src/components/TimeRemaining.tsx` - Time remaining display ⏳
12. `src/App.tsx` - Main app ⏳
13. `src/main.tsx` - Entry point ⏳
14. `src/App.css` - Main styles ⏳

---

## Dependencies Installed

### Production Dependencies
- `react@18.3.1` - UI library
- `react-dom@18.3.1` - React DOM renderer
- `date-fns@4.1.0` - Date manipulation

### Development Dependencies
- `@vitejs/plugin-react@4.3.4` - Vite React plugin
- `typescript@5.6.2` - TypeScript compiler
- `@types/react@18.3.18` - React type definitions
- `@types/react-dom@18.3.5` - React DOM types
- `vite@6.0.5` - Build tool
- `eslint@9.17.0` - Linting
- `eslint-plugin-react-hooks@5.1.0` - React hooks linting
- Plus additional ESLint plugins and configs

**Total Packages:** 222 (0 vulnerabilities)

---

## Git Workflow (When Ready)

Per user's global instructions, never commit directly to main:

```bash
# Initialize git (if not done)
git init

# Create feature branch
git checkout -b feat/initial-implementation

# Make commits as features are completed
git add .
git commit -m "feat: add time calculation logic

- Implement calculateTimeLived function
- Implement calculateTimeRemaining function
- Handle edge cases (leap years, over expectancy)
- Add comprehensive TypeScript types

🤖 Generated with Claude Code

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# When ready, create PR (using gh CLI)
git push -u origin feat/initial-implementation
gh pr create --title "Initial LifeClock Implementation" --body "..."
```

---

## Troubleshooting Guide

### Issue: TypeScript Errors
- **Solution:** Check tsconfig strictness, ensure all types are defined
- **Tool:** `npm run build` to see compilation errors

### Issue: Date Calculations Incorrect
- **Solution:** Verify using date-fns correctly, check leap year handling
- **Tool:** Console.log intermediate values, write unit tests

### Issue: LocalStorage Not Persisting
- **Solution:** Check browser privacy mode, verify JSON serialization
- **Tool:** Browser DevTools > Application > Local Storage

### Issue: Clocks Not Updating
- **Solution:** Verify setInterval is running, check React re-rendering
- **Tool:** React DevTools, console.log in useEffect

### Issue: Bundle Size Too Large
- **Solution:** Check for unused imports, ensure date-fns tree-shaking
- **Tool:** `npm run build` and check dist/ sizes

---

## Success Criteria

Project is complete when:
- ✓ All files in "Pending Structure" are created
- ✓ App runs without errors (`npm run dev`)
- ✓ All tests in "Testing Checklist" pass
- ✓ Production build succeeds (`npm run build`)
- ✓ Deployed and accessible via URL
- ✓ User feedback is positive

---

## Notes for AI Resuming

1. **Read PRD.md first** - Understand requirements and decisions
2. **Check current file structure** - See what exists with `ls -R src/`
3. **Review completed files** - Read existing code to understand patterns
4. **Follow the order** - Implement in the sequence listed above
5. **Test incrementally** - Don't wait until end to test
6. **Update this file** - Mark tasks complete as you go
7. **Update todo list** - Keep TodoWrite in sync with progress
8. **Ask user questions** - If requirements unclear, use AskUserQuestion

**Key Context:**
- User name: Sonu
- Working dir: `/home/sonu/CodeProjects/LifeClock`
- Platform: Web (React + TypeScript + Vite)
- Life expectancy: Country + Gender based (embedded JSON)
- No backend, no external APIs, all client-side
- Privacy-first (localStorage only)

---

**Last Updated:** 2026-01-09
**Updated By:** Claude Sonnet 4.5
**Next Update:** After completing timeCalculations.ts
