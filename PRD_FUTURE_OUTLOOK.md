# LifeClock - Future Outlook Feature PRD

## Feature Overview

**Feature Name:** Future Outlook
**Version:** 2.0
**Last Updated:** 2026-01-12
**Status:** Planning
**Parent Product:** LifeClock

### Purpose
Future Outlook transforms abstract life expectancy into tangible, emotionally resonant milestones. Instead of showing "X years remaining," it shows "43 summers left," "156 weekends left," or "12 more Christmases." This feature makes time finite and precious, inspiring users to act on what matters.

### Vision
Help users viscerally understand their finite time by breaking it into meaningful experiences (summers, holidays, weekends) rather than abstract units (years, days). Drive action through emotional connection to real experiences they'll miss if they don't seize opportunities.

---

## Key Design Decisions

### Core Philosophy
- **Experience-based, not time-based**: "15 summers" hits harder than "15 years"
- **Personalized milestones**: Users choose which events matter to them
- **Motivational, not morbid**: Framing should inspire action, not induce anxiety
- **Privacy-first**: All calculations client-side, no external APIs

### Calculation Methodology
- **Baseline:** Life expectancy from existing LifeClock data (country + gender)
- **Annual Events:** Count occurrences from current date to expected end date
- **Inclusive Counting:** If event already occurred this year, count it
- **Cultural Sensitivity:** Users select which holidays matter to them (not everyone celebrates Christmas)

### Technical Approach
- **Integration:** New section below existing clocks (Time Lived / Time Remaining)
- **Real-time Updates:** Recalculate when event passes (e.g., birthday just happened, count decreases)
- **Storage:** User's selected milestones saved to localStorage
- **Performance:** Pre-calculate on mount, only recalculate when day changes

---

## User Stories

### Primary User Stories

**US-FO-1: View Life Milestones**
- As a user, I want to see how many significant life events I have left so I feel motivated to make them count
- Acceptance Criteria:
  - Display cards/metrics for key milestones (birthdays, summers, weekends)
  - Update counts in real-time (or when new day begins)
  - Show visually distinct from time clocks
  - Include brief explanation of calculation methodology

**US-FO-2: Customize Tracked Milestones**
- As a user, I want to choose which milestones matter to me so the data feels personally relevant
- Acceptance Criteria:
  - Settings/preferences panel to select milestones
  - Pre-configured options: Birthdays, Summers, Winters, Spring, Fall, Weekends, Holidays
  - Custom holidays: User can add specific dates (e.g., "Anniversary," "Family Reunion")
  - Save preferences to localStorage
  - Default set for new users (birthdays, summers, weekends)

**US-FO-3: Holiday Selection**
- As a user from any culture, I want to select holidays I celebrate so the data reflects my life
- Acceptance Criteria:
  - Multi-select list of major holidays (Christmas, Hanukkah, Eid, Diwali, Lunar New Year, etc.)
  - Option to add custom annual dates (e.g., "My child's birthday")
  - Recurring vs. one-time events distinguished
  - Calculated based on user's remaining life expectancy

**US-FO-4: Motivational Context**
- As a user, I want to understand why this data matters so I'm inspired to take action
- Acceptance Criteria:
  - Brief tagline or quote above metrics ("Make them count" / "Time is finite. Experiences are precious.")
  - Optional: Toggle for showing/hiding motivational messages
  - Avoid morbid language, focus on opportunity and action

### Secondary User Stories

**US-FO-5: Milestone Details**
- As a curious user, I want to understand how calculations work so I trust the data
- Acceptance Criteria:
  - Hover/tap on milestone to see calculation explanation
  - Example: "Based on life expectancy of 82, you have ~43 summers remaining (current year counts as 1)"
  - Link to FAQ or methodology page

**US-FO-6: Historical Comparison**
- As a user, I want to see milestones already lived vs. remaining
- Acceptance Criteria:
  - Optional view: "You've experienced 35 summers, 43 remain"
  - Percentage visualization (e.g., progress bar)
  - Toggle between "remaining only" and "lived vs. remaining"

---

## Functional Requirements

### FR-FO-1: Milestone Calculation Engine
**Required Milestones:**
1. **Birthdays**: Count years from current age to life expectancy
2. **Summers**: Count June 21 - September 20 periods remaining
3. **Winters**: Count December 21 - March 19 periods remaining
4. **Spring**: Count March 20 - June 20 periods remaining
5. **Fall**: Count September 21 - December 20 periods remaining
6. **Weekends**: Count Saturday-Sunday pairs from now to end date
7. **Holidays**: Count specific recurring dates (configurable)

**Calculation Logic:**
- Input: Current date, birth date, life expectancy date, milestone type
- Output: Integer count of occurrences between now and life expectancy
- Handle partial periods (if currently in summer, count it as 1)
- Account for leap years in annual calculations
- Recalculate when day changes (midnight boundary)

### FR-FO-2: Holiday Configuration System
**Built-in Holidays:**
- Christmas (Dec 25)
- New Year's Eve (Dec 31)
- New Year's Day (Jan 1)
- Thanksgiving (4th Thursday of November, US)
- Easter (calculated, varies yearly)
- Hanukkah (calculated, varies yearly)
- Eid al-Fitr (calculated, varies yearly)
- Eid al-Adha (calculated, varies yearly)
- Diwali (calculated, varies yearly)
- Lunar New Year (calculated, varies yearly)
- Independence Day (July 4, US-specific)

**Custom Holiday Features:**
- User can add name + date (MM/DD format for annual)
- User can add one-time events (full date MM/DD/YYYY)
- Max 10 custom holidays to prevent clutter
- Validation: No duplicate names, valid dates only

### FR-FO-3: Data Persistence
**LocalStorage Schema Extension:**
```typescript
interface FutureOutlookData {
  selectedMilestones: string[];  // Array of milestone IDs: ['birthdays', 'summers', 'weekends']
  selectedHolidays: string[];    // Array of holiday IDs: ['christmas', 'thanksgiving']
  customHolidays: CustomHoliday[];
  showMotivational: boolean;
  viewMode: 'remaining' | 'comparison';  // Show only remaining vs. lived + remaining
  lastUpdated: string;
}

interface CustomHoliday {
  id: string;
  name: string;
  date: string;  // MM/DD for annual, MM/DD/YYYY for one-time
  isAnnual: boolean;
}
```

### FR-FO-4: Real-time Updates
- Calculate milestones on initial load
- Set interval to check if date changed (check every 60 seconds, compare cached date)
- When date changes, recalculate all milestones
- Avoid unnecessary recalculations (memoization)

### FR-FO-5: Display Format
**Milestone Card Format:**
```
┌─────────────────────────┐
│  🎂 BIRTHDAYS           │
│                         │
│       43                │
│    remaining            │
│                         │
│  ℹ️ See calculation     │
└─────────────────────────┘
```

**Layout Options:**
- Grid layout (2-3 columns on desktop, 1-2 on mobile)
- Card-based design, visually distinct from clocks
- Icons for each milestone type
- Large numbers, small labels (consistent with existing clocks)

---

## User Interface Design

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│              LifeClock                          │
│              [tagline]                          │
├─────────────────────────────────────────────────┤
│   ┌───────────┐       ┌───────────┐            │
│   │ TIME      │       │   TIME    │            │
│   │ LIVED     │       │ REMAINING │            │
│   └───────────┘       └───────────┘            │
├─────────────────────────────────────────────────┤
│          FUTURE OUTLOOK                         │
│   "Make every moment count"         [⚙️ Config] │
│                                                 │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐      │
│   │ 🎂   │  │ ☀️   │  │ 🎉   │  │ 🏖️   │      │
│   │  43  │  │  43  │  │  12  │  │ 156  │      │
│   │Birth │  │Summer│  │Xmas  │  │Week  │      │
│   │days  │  │  s   │  │      │  │ends  │      │
│   └──────┘  └──────┘  └──────┘  └──────┘      │
│                                                 │
│   [+ Add Milestone]  [View All]                 │
└─────────────────────────────────────────────────┘
```

### Configuration Panel
```
┌─────────────────────────────────────┐
│  Future Outlook Settings        [X] │
├─────────────────────────────────────┤
│                                     │
│  Select Milestones to Track:        │
│  ☑️ Birthdays                       │
│  ☑️ Summers                         │
│  ☐ Winters                          │
│  ☐ Spring                           │
│  ☐ Fall                             │
│  ☑️ Weekends                        │
│                                     │
│  Select Holidays:                   │
│  ☑️ Christmas                       │
│  ☐ Thanksgiving                     │
│  ☐ New Year's Eve                   │
│  ☐ Easter                           │
│  [+ Add Custom Holiday]             │
│                                     │
│  Display Options:                   │
│  ⚪ Show remaining only              │
│  ⚫ Show lived vs. remaining         │
│                                     │
│  ☑️ Show motivational messages      │
│                                     │
│         [Save Changes]              │
└─────────────────────────────────────┘
```

### Visual Design

**Color Palette:**
- Future Outlook section: Warm, hopeful tones (gold, amber, soft orange)
- Milestone cards: Gradient backgrounds, distinct from clock blues
- Icons: Emoji or simple SVG icons for universal understanding

**Typography:**
- Large numbers: Same bold monospace as clocks (consistency)
- Labels: Smaller, sans-serif, medium weight
- Motivational text: Italic or script font for emphasis

**Spacing:**
- Clear visual separation from clocks (horizontal rule or margin)
- Card grid with equal spacing, responsive (2-4 cards per row)

---

## Edge Cases & Error Handling

### Edge Case 1: User Exceeds Life Expectancy
- **Scenario:** User is 85, life expectancy is 82
- **Handling:** Show message "You're living beyond expectations! Every day is a gift."
- **Display:** Milestone counts show as "N/A" or hide section entirely (user preference)

### Edge Case 2: Very Young User
- **Scenario:** User is 2 years old, has 80+ of each milestone remaining
- **Handling:** Display normally, but consider adding note "A lifetime of experiences ahead!"
- **Display:** No special handling needed, large numbers are accurate

### Edge Case 3: Milestone Happened Today
- **Scenario:** Today is user's birthday, what count to show?
- **Handling:** Count today's birthday as "lived," remaining count decreases by 1
- **Display:** Show celebration animation/message on milestone day (optional enhancement)

### Edge Case 4: Invalid Custom Holiday Date
- **Scenario:** User enters Feb 30 or 13/45
- **Handling:** Form validation prevents submission
- **Message:** "Please enter a valid date (MM/DD or MM/DD/YYYY)"

### Edge Case 5: Too Many Selected Milestones
- **Scenario:** User selects 20+ milestones, UI cluttered
- **Handling:** Limit to 8 visible cards, "View All" button for overflow
- **Display:** Show top 8 by user preference order, rest in expanded view

### Edge Case 6: Calculated Holiday Falls After Life Expectancy
- **Scenario:** Eid or Easter calculated to occur after expected death
- **Handling:** Don't count that occurrence in the total
- **Display:** Count only holidays between now and life expectancy date

---

## Non-Functional Requirements

### NFR-FO-1: Performance
- Milestone calculations complete in < 50ms
- No impact on existing clock performance (still 60fps)
- Recalculation triggered max once per minute (date change check)
- Lazy load configuration panel (code splitting)

### NFR-FO-2: Accessibility
- All milestone cards keyboard navigable
- ARIA labels for all interactive elements
- Screen readers announce counts with context ("43 birthdays remaining")
- High contrast mode support for cards
- Focus indicators on all interactive elements

### NFR-FO-3: Privacy
- All calculations client-side (consistent with LifeClock ethos)
- No external API calls for holiday dates (embed calculation logic)
- LocalStorage only for user preferences
- No tracking of which milestones users view

### NFR-FO-4: Bundle Size Impact
- Future Outlook feature adds < 30KB to bundle (gzipped)
- Holiday calculation libraries tree-shakeable
- Consider lazy loading this entire feature (code split)

---

## Technical Implementation Notes

### Date Calculation Libraries
**Option 1: Pure date-fns** (Preferred)
- Already in project, no new dependencies
- `eachMonthOfInterval`, `eachWeekendOfInterval`, `eachYearOfInterval`
- Manual season calculation (compare month/day)

**Option 2: Add holiday calculation library**
- Consider for complex holidays (Easter, lunar calendar events)
- Trade-off: Bundle size vs. accuracy
- Recommendation: Embed calculation formulas, avoid external lib

### Season Definitions
- **Summer:** June 21 (summer solstice) - Sept 20
- **Fall:** Sept 21 (autumnal equinox) - Dec 20
- **Winter:** Dec 21 (winter solstice) - March 19
- **Spring:** March 20 (vernal equinox) - June 20

Note: Based on Northern Hemisphere. Consider user location setting for hemisphere-appropriate seasons (future enhancement).

### Holiday Calculation Formulas
**Easter (Meeus/Jones/Butcher algorithm):**
```typescript
function calculateEaster(year: number): Date {
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
```

**Thanksgiving (US):**
```typescript
function calculateThanksgiving(year: number): Date {
  const november = new Date(year, 10, 1); // November 1st
  const firstDay = november.getDay();
  const firstThursday = 1 + (4 - firstDay + 7) % 7;
  const fourthThursday = firstThursday + 21;
  return new Date(year, 10, fourthThursday);
}
```

---

## Data Schema

### Milestone Types Enum
```typescript
type MilestoneType =
  | 'birthdays'
  | 'summers'
  | 'winters'
  | 'spring'
  | 'fall'
  | 'weekends'
  | 'holidays';

interface Milestone {
  id: string;
  type: MilestoneType;
  label: string;
  icon: string;  // Emoji or icon identifier
  count: number;
  description?: string;  // Hover text
}
```

### Holiday Definitions
```typescript
interface HolidayDefinition {
  id: string;
  name: string;
  type: 'fixed' | 'calculated' | 'custom';
  date?: string;  // MM/DD for fixed dates
  calculateFn?: (year: number) => Date;  // For calculated holidays
}
```

---

## Success Metrics

### Phase 1 (Development)
- All milestone calculations are accurate (validated against manual counts)
- No performance degradation (clock still runs at 60fps)
- Configuration panel is intuitive (internal testing: < 2 minutes to configure)
- LocalStorage schema validated and tested

### Phase 2 (User Testing)
- Users understand milestone counts immediately (no confusion)
- Configuration completion rate > 70% (users customize milestones)
- No reported calculation errors
- Positive emotional response (motivational, not anxiety-inducing)

### Phase 3 (Production)
- Feature adoption rate > 60% (percentage of users who interact with it)
- Average milestones tracked per user: 3-5
- User feedback: "Inspiring," "Eye-opening," "Makes me want to act"

---

## Out of Scope (For This Version)

### Retirement Tracker
- Deferred to version 2.1 (separate feature)
- Requires additional inputs (savings, expenses, retirement age, inflation)
- More complex UI (forms, charts, projections)
- Different emotional tone (financial planning vs. life experiences)

### Social Features
- Sharing milestone counts on social media
- Comparing with friends
- Community challenges ("Make 52 weekend adventures")

### Advanced Visualizations
- Timeline showing milestones distributed over remaining life
- Heatmap of milestone density
- Animated counters

### Notifications
- Browser notifications when milestone occurs (birthday, holiday)
- Reminders to "make the most" of limited milestones

### Hemisphere-Specific Seasons
- Auto-detect or manually set Northern/Southern hemisphere
- Invert season definitions accordingly

---

## Future Enhancements (Post-v2.0)

### Version 2.1
- **Retirement Tracker**: Separate feature for financial planning
- **Milestone History**: Log when milestones occur, build a journal
- **Shareable Cards**: Generate beautiful images of milestone counts

### Version 2.2
- **Goal Integration**: Link milestones to specific goals (e.g., "Visit 43 new places in 43 summers")
- **Milestone Notifications**: Optional reminders on milestone days
- **Reflection Prompts**: Journaling questions tied to milestone counts

### Version 3.0
- **Advanced Visualizations**: Timeline view, heatmaps, animated counters
- **Social Features**: Share milestones, community challenges
- **AI-Powered Insights**: Personalized suggestions based on milestone data

---

## Finalized Design Decisions

**Decision Date:** 2026-01-12
**Status:** All key decisions finalized, ready for implementation

### 1. Default Milestones
**Decision:** Birthdays, Summers, and Weekends enabled by default
**Rationale:** Simple, emotionally resonant trio that provides immediate value without overwhelming new users. Users can easily add more through configuration.

### 2. Calculated Holidays
**Decision:** Include in v1.0 (Easter, Thanksgiving)
**Rationale:** Calculation functions are small (~50 lines), add significant user value, and demonstrate feature completeness.

### 3. Motivational Messaging
**Decision:** Enabled by default with user toggle
**Rationale:** Tagline "Make every moment count" is inspirational but respectful. Users who prefer pure data can disable it.

### 4. Mobile Layout
**Decision:** Auto-fit grid (adapts to screen width)
**CSS:** `grid-template-columns: repeat(auto-fit, minmax(120px, 1fr))`
**Rationale:** Flexible approach works across all device sizes (2-3 cards per row depending on width). To be validated during testing.

### 5. Calculation Transparency
**Decision:** Inline tooltips on hover/tap
**Rationale:** Lightweight, accessible explanation without cluttering UI. Can add FAQ link in v1.1 if users request more detail.

### 6. Hemisphere Handling
**Decision:** Northern hemisphere only for v1.0
**Rationale:** Affects minority of users, adds complexity. Deferred to v2.1 as "Hemisphere-Specific Seasons" feature.

### 7. Timeline Integration
**Decision:** Separate section only (not integrated with existing timeline)
**Rationale:** Clean separation of concerns. Timeline integration deferred to v2.0 as "Advanced Visualization" feature.

### 8. Milestone Card Colors
**Decision:** Single warm gradient for all cards
**Colors:** Gold to amber gradient (#ffeaa7 to #fdcb6e)
**Rationale:** Consistent, warm, motivational tone. Can add per-milestone colors in v1.1 if desired.

---

## Dependencies

### Internal Dependencies
- Existing `useLifeExpectancy` hook (for end date calculation)
- Existing `useLocalStorage` hook (for persisting preferences)
- Existing `UserData` type (birthday, life expectancy)

### External Dependencies
- **date-fns** (already in project): For interval calculations
  - `eachWeekendOfInterval`
  - `eachYearOfInterval`
  - `differenceInDays`
  - `isWithinInterval`

### New Files to Create
- `src/components/FutureOutlook.tsx` - Main component
- `src/components/MilestoneCard.tsx` - Individual milestone display
- `src/components/MilestoneConfig.tsx` - Configuration panel
- `src/utils/milestoneCalculations.ts` - Calculation logic
- `src/utils/holidayCalculations.ts` - Holiday date calculations
- `src/types/milestones.ts` - TypeScript interfaces
- `src/data/holidays.json` - Holiday definitions

---

## Risks & Mitigation

### Risk 1: Calculations Too Complex (Performance)
- **Mitigation:** Pre-calculate on mount, cache results, only recalculate on date change
- **Fallback:** Simplify calculations (approximate vs. exact)

### Risk 2: Emotionally Negative Impact
- **Mitigation:** User testing to validate tone, add toggle to hide feature
- **Fallback:** Emphasize "time well spent" over "running out"

### Risk 3: Bundle Size Bloat
- **Mitigation:** Lazy load feature, tree-shake unused calculations
- **Fallback:** Make feature opt-in, don't load code unless activated

### Risk 4: Holiday Calculation Errors
- **Mitigation:** Thorough testing, use well-established algorithms
- **Fallback:** Allow manual date override for calculated holidays

### Risk 5: Cultural Insensitivity
- **Mitigation:** User-selected holidays, no defaults based on country
- **Fallback:** Clear labeling, educational tooltips about holiday origins

---

## Approval & Sign-off

**Product Owner:** Sonu
**Approved Date:** 2026-01-12
**Implementation Plan:** IMPLEMENTATION_FUTURE_OUTLOOK.md
**Status:** ✅ Approved - Ready for Implementation
**Next Review:** After v1.0 implementation complete

---

## Appendix: Milestone Calculation Examples

### Example 1: Birthdays
- **User:** Born Jan 15, 1990, currently 36 years old
- **Life Expectancy:** 82 years (46 years remaining)
- **Calculation:** 82 - 36 = 46 birthdays remaining

### Example 2: Summers
- **User:** Currently March 2026, life expectancy Aug 2072
- **Calculation:** Count June 21 - Sept 20 intervals from March 2026 to Aug 2072
- **Result:** 46 complete summers

### Example 3: Weekends
- **User:** Currently Jan 12, 2026 (Sunday), life expectancy Aug 15, 2072
- **Calculation:** Count Saturday-Sunday pairs from Jan 18, 2026 to Aug 15, 2072
- **Result:** ~2,426 weekends remaining

### Example 4: Christmas
- **User:** Currently Jan 12, 2026, life expectancy Aug 15, 2072
- **Calculation:** Count Dec 25 occurrences from 2026 to 2072
- **Result:** 46 Christmases remaining (2026-2071, not counting 2072 since death is in August)
