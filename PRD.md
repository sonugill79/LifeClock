# LifeClock - Product Requirements Document

## Project Overview

**Product Name:** LifeClock
**Version:** 1.0
**Last Updated:** 2026-01-09
**Status:** In Development

### Purpose
LifeClock is a web application that displays two real-time clocks showing:
1. **Time Lived**: Exact time the user has been alive (from birth to current moment)
2. **Time Remaining**: Estimated time left to live based on statistical life expectancy

### Vision
Help users gain perspective on their finite time, inspire mindfulness, and motivate purposeful living by visualizing life's passage in real-time.

---

## Key Decisions Made

### Technology Stack
- **Platform:** Web Application (chosen over Desktop/Mobile for ease of sharing and cross-device access)
- **Framework:** React with TypeScript
- **Build Tool:** Vite (fast dev server, modern tooling)
- **Date Library:** date-fns (tree-shakeable, accurate calculations)
- **Styling:** CSS Modules (decided during implementation)
- **State Management:** React Hooks only (no Redux/external library needed)
- **Data Storage:** LocalStorage for user preferences

### Life Expectancy Calculation
- **Approach:** Statistical calculation based on gender AND country
- **Data Source:** WHO (World Health Organization) 2023 data
- **Data Format:** Embedded static JSON file (offline-capable)
- **Coverage:** 100+ countries with male/female/combined life expectancy values

### Key Architectural Decisions
1. **Client-side only** - No backend, all calculations happen in browser
2. **Embedded data** - Life expectancy JSON bundled with app (no API calls)
3. **Privacy-first** - All user data stays on device (localStorage only)
4. **Real-time updates** - Single 1-second interval for both clocks
5. **Performance optimized** - Memoized calculations, minimal re-renders

---

## User Stories

### Primary User Stories

**US-1: Initial Setup**
- As a new user, I want to input my birthday, gender, and country so the clocks can start tracking my life
- Acceptance Criteria:
  - Date picker for birthday (no future dates allowed)
  - Gender selector (Male/Female)
  - Country dropdown (searchable, 100+ countries)
  - Form validation prevents invalid submissions
  - Data persists in localStorage

**US-2: Time Lived Clock**
- As a user, I want to see exactly how long I've been alive in years, months, days, hours, minutes, and seconds
- Acceptance Criteria:
  - Updates every second
  - Accurate calculations accounting for leap years
  - Clear, large, readable display
  - Breakdown: XX years, XX months, XX days, XX:XX:XX

**US-3: Time Remaining Clock**
- As a user, I want to see how much time I have left based on statistical life expectancy
- Acceptance Criteria:
  - Calculated from country + gender life expectancy data
  - Updates every second (counting down)
  - Same format as Time Lived clock
  - Graceful handling if user exceeds life expectancy

**US-4: Data Persistence**
- As a returning user, I want my data saved so I don't have to re-enter it
- Acceptance Criteria:
  - Birthday, gender, country saved to localStorage
  - Auto-loaded on page refresh
  - Option to edit/change data

### Secondary User Stories

**US-5: Edit Information**
- As a user, I want to update my birthday, gender, or country if I entered it incorrectly
- Acceptance Criteria:
  - "Edit Details" button visible when clocks are running
  - Returns to input form pre-filled with current data
  - Updates clocks immediately upon save

**US-6: Responsive Design**
- As a mobile user, I want the app to work well on my phone
- Acceptance Criteria:
  - Mobile-first responsive design
  - Two-column layout on desktop
  - Stacked vertical layout on mobile
  - Touch-friendly controls

---

## Functional Requirements

### FR-1: Time Calculations
- Calculate exact time difference between two dates (birth to now)
- Break down into years, months, days, hours, minutes, seconds
- Handle leap years correctly
- Use user's local timezone
- Update calculations every 1000ms (1 second)

### FR-2: Life Expectancy Lookup
- Load embedded JSON data with country life expectancy
- Lookup by country code (ISO 3166-1 alpha-3)
- Return gender-specific value (male/female)
- Fallback to "both" value if gender-specific unavailable
- Support 100+ countries

### FR-3: User Input Validation
- Birthday must be in the past (not future)
- Birthday cannot be more than 120 years ago
- Gender must be selected
- Country must be selected from dropdown
- All fields required before starting clocks

### FR-4: LocalStorage Persistence
- Save user data on submission
- Load saved data on app initialization
- Update timestamp on each save
- Clear data if corrupted/invalid
- Schema: `{ birthday, gender, country, lastUpdated }`

### FR-5: Real-time Updates
- Single interval timer updating every second
- Both clocks update simultaneously
- Memoized calculations to prevent unnecessary re-renders
- 60fps smooth rendering

---

## Non-Functional Requirements

### NFR-1: Performance
- Initial load time < 2 seconds on 3G
- 60fps clock updates (no jank)
- Bundle size < 200KB gzipped
- Time-to-interactive < 3 seconds

### NFR-2: Accessibility
- WCAG 2.1 AA compliant
- Semantic HTML structure
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatible

### NFR-3: Browser Support
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### NFR-4: Privacy & Security
- No data sent to servers
- No analytics/tracking
- HTTPS deployment required
- LocalStorage only (no cookies)
- Open source transparency

---

## User Interface Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│         LifeClock                       │
│         [tagline]                       │
├─────────────────────────────────────────┤
│                                         │
│   (If no data: Input Form)              │
│   ┌───────────────────────────────────┐ │
│   │ Birthday: [Date Picker]           │ │
│   │ Gender:   [Male] [Female]         │ │
│   │ Country:  [Dropdown]              │ │
│   │                                   │ │
│   │        [Start Your LifeClock]     │ │
│   └───────────────────────────────────┘ │
│                                         │
│   (If data exists: Clocks)              │
│   ┌───────────┐       ┌───────────┐    │
│   │ TIME      │       │   TIME    │    │
│   │ LIVED     │       │ REMAINING │    │
│   │           │       │           │    │
│   │ XX years  │       │ XX years  │    │
│   │ XX months │       │ XX months │    │
│   │ XX days   │       │ XX days   │    │
│   │ XX:XX:XX  │       │ XX:XX:XX  │    │
│   └───────────┘       └───────────┘    │
│                                         │
│   [Edit Details]                        │
│                                         │
└─────────────────────────────────────────┘
```

### Color Scheme
- **Time Lived**: Blue/Green tones (achievement, growth)
- **Time Remaining**: Orange/Purple tones (urgency, motivation)
- **Background**: Clean white/dark gray (theme-dependent)
- **Text**: High contrast for readability

### Typography
- **Clock Numbers**: Large, bold, monospace font
- **Labels**: Sans-serif, medium weight
- **Body Text**: Sans-serif, regular weight
- **Minimum Sizes**: 16px base font (mobile), 18px (desktop)

---

## Data Schema

### Life Expectancy JSON
```json
{
  "USA": {
    "countryName": "United States",
    "male": 74.5,
    "female": 80.2,
    "both": 77.3
  }
}
```

### LocalStorage Structure
```typescript
interface StoredUserData {
  birthday: string;      // ISO 8601 format
  gender: 'male' | 'female';
  country: string;       // ISO 3166-1 alpha-3
  lastUpdated: string;   // ISO 8601 timestamp
}
```

---

## Edge Cases & Error Handling

### Edge Case 1: User Older Than Life Expectancy
- **Scenario:** User is 82 years old, life expectancy is 80
- **Handling:** Show "Living beyond expectations!" message
- **Display:** Time Remaining shows positive extra time or motivational message

### Edge Case 2: Future Birthday
- **Scenario:** User tries to enter a birthday in the future
- **Handling:** Form validation prevents submission
- **Message:** "Birthday must be in the past"

### Edge Case 3: Very Old Birthday
- **Scenario:** User enters birthday 150 years ago
- **Handling:** Form validation prevents submission
- **Message:** "Please enter a valid birthday (max 120 years ago)"

### Edge Case 4: Missing Country Data
- **Scenario:** Country code not found in JSON
- **Handling:** Use global average (73 years)
- **Message:** Warning shown to user

### Edge Case 5: Corrupted LocalStorage
- **Scenario:** Stored data is malformed/corrupted
- **Handling:** Clear storage, show input form
- **Message:** "Please re-enter your information"

### Edge Case 6: Browser Doesn't Support LocalStorage
- **Scenario:** Old browser or private mode blocking storage
- **Handling:** App works but doesn't persist data
- **Message:** Warning about data not being saved

---

## Success Metrics

### Phase 1 (MVP Launch)
- App loads successfully in all supported browsers
- Calculations are accurate to the second
- No console errors or warnings
- LocalStorage persistence works reliably
- Mobile responsive design verified

### Phase 2 (User Validation)
- Users can complete full flow (input → clocks) in < 30 seconds
- No reported calculation errors
- Positive user feedback on design/UX
- Performance metrics met (load time, bundle size, fps)

---

## Future Enhancements (Post-MVP)

### Version 1.1
- Dark/Light theme toggle
- Progress bar showing % of life lived
- Share functionality (generate image)

### Version 1.2
- Statistics panel (total heartbeats, breaths, days lived)
- Milestones (highlight significant ages: 18, 21, 30, etc.)
- Multiple profiles (track family members)

### Version 2.0
- PWA support (offline mode, install to home screen)
- Export data (PDF, JSON)
- Motivational quotes based on time remaining
- Integration with bucket list/goals app

---

## Technical Constraints

1. **No Backend** - Pure client-side application
2. **No External APIs** - All data embedded for offline capability
3. **Single-Page App** - No routing library needed for MVP
4. **TypeScript Strict Mode** - All code must be type-safe
5. **Browser LocalStorage Limit** - Max 5-10MB (sufficient for our needs)

---

## Glossary

- **Time Lived**: Total duration from birth to current moment
- **Time Remaining**: Estimated duration from now to statistical death
- **Life Expectancy**: Average number of years a person is expected to live (WHO data)
- **ISO 3166-1 alpha-3**: Three-letter country codes (USA, GBR, JPN, etc.)
- **LocalStorage**: Browser storage API for client-side data persistence

---

## Approval & Sign-off

**Product Owner:** Sonu
**Approved Date:** 2026-01-09
**Next Review:** Upon MVP completion
