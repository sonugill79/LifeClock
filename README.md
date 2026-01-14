# LifeClock

**Every second counts. Make them matter.**

LifeClock is a web application that visualizes your life in real-time, showing exactly how much time you've lived and how much time remains based on statistical life expectancy.

![LifeClock Preview](https://via.placeholder.com/800x400/3b82f6/ffffff?text=LifeClock)

## Features

- **Time Lived Clock**: Real-time display of your exact age down to the second
- **Time Remaining Clock**: Statistical countdown based on your country and gender
- **Income-Based Life Expectancy** ✨ **NEW**: US users can get more accurate estimates based on household income (up to 14 years difference)
- **Future Outlook**: See how many birthdays, summers, weekends, and holidays you have left to make them count
- **Life Timeline**: Visual grid representation of your life (years, months, or weeks view)
- **100+ Countries**: Comprehensive life expectancy data from WHO 2023
- **Customizable Milestones**: Choose which life events matter to you
- **Privacy-First**: All data stays on your device (localStorage only)
- **Responsive Design**: Works beautifully on mobile and desktop
- **Offline Capable**: No internet required after initial load
- **Zero Analytics**: Your data is yours alone

## Live Demo

**Development Server**: The app is currently running at http://localhost:5173/

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **First Visit**: Enter your birthday, gender, and country
2. **Watch Time**: See your life tick by in real-time
3. **View Milestones**: Scroll down to see Future Outlook showing birthdays, summers, weekends, and holidays remaining
4. **Customize**: Click the gear icon (⚙️) to select which milestones and holidays matter to you
5. **Edit Anytime**: Click "Edit Details" to update your information
6. **Data Persists**: All settings are saved automatically to your browser

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Date Library**: date-fns 4.1
- **Styling**: CSS (no framework dependencies)
- **State Management**: React Hooks (no Redux needed)
- **Storage**: Browser localStorage

## Project Structure

```
src/
├── components/          # React components
│   ├── ClockDisplay.tsx        # Reusable clock component
│   ├── UserInputForm.tsx       # Data entry form
│   ├── TimeLived.tsx           # Time lived wrapper
│   ├── TimeRemaining.tsx       # Time remaining wrapper
│   ├── LifeTimeline.tsx        # Timeline visualization
│   └── FutureOutlook/          # Future Outlook feature
│       ├── FutureOutlook.tsx   # Main container
│       ├── MilestoneCard.tsx   # Individual milestone display
│       └── MilestoneConfig.tsx # Configuration modal
├── hooks/               # Custom React hooks
│   ├── useTimeDifference.ts    # Real-time calculations
│   ├── useLocalStorage.ts      # Persistent storage
│   ├── useLifeExpectancy.ts    # Life expectancy lookup
│   ├── useMilestones.ts        # Milestone calculations
│   └── useFutureOutlookStorage.ts  # Future Outlook preferences
├── utils/               # Utility functions
│   ├── timeCalculations.ts     # Core date math
│   ├── milestoneCalculations.ts # Milestone logic
│   ├── holidayCalculations.ts  # Holiday date algorithms
│   └── lifeExpectancyCalculator.ts  # Data lookup
├── data/                # Static data
│   ├── lifeExpectancy.json     # WHO life expectancy data
│   └── holidays.json           # Holiday definitions
├── types/               # TypeScript definitions
│   ├── index.ts                # Core types
│   └── milestones.ts           # Future Outlook types
├── App.tsx              # Main app component
├── App.css              # Global styles
└── main.tsx             # Entry point
```

## Documentation

- **[PRD.md](./PRD.md)**: Product Requirements Document
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)**: Detailed implementation guide
- **[METHODOLOGY.md](./METHODOLOGY.md)**: Data sources and calculation methodology
- **[PRIVACY.md](./PRIVACY.md)**: Privacy policy and data handling

## Performance

- **Bundle Size**: ~54KB gzipped (CSS + JS)
- **Load Time**: < 2 seconds on 3G
- **Update Rate**: 1 second (60fps rendering)
- **Dependencies**: 3 production packages only

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Privacy & Security

- **No Backend**: Pure client-side application
- **No Tracking**: Zero analytics or third-party scripts
- **Local Storage Only**: Your data never leaves your device
- **HTTPS Ready**: Deploy on secure hosts (Vercel, Netlify)
- **Open Source**: Full transparency

## Data Sources

Life expectancy data sourced from:

### WHO (World Health Organization)
- **Source**: WHO Global Health Observatory 2023 statistics
- **Coverage**: 100+ countries worldwide
- **Granularity**: Male/Female/Combined values
- **Used For**: Default estimates for all users, only source for non-US countries

### The Health Inequality Project (US Only)
- **Source**: Chetty et al. (2016) - 1.4 billion tax records paired with Social Security mortality data
- **Coverage**: United States income-based life expectancy (1st-100th percentile)
- **Granularity**: Income percentile + gender
- **Used For**: More accurate estimates for US users who provide household income
- **Accuracy**: Income affects US life expectancy by up to 14.6 years
- **Privacy**: Income converted to percentile locally, never sent to any server

📊 **See [METHODOLOGY.md](./METHODOLOGY.md) for full calculation details**
🔒 **See [PRIVACY.md](./PRIVACY.md) for data privacy information**

## Edge Cases Handled

- ✓ Users older than life expectancy ("Living beyond expectations!")
- ✓ Future birthdays (validation prevents)
- ✓ Very old birthdays (max 120 years)
- ✓ Leap years (date-fns handles correctly)
- ✓ Timezone consistency (uses local time)
- ✓ Missing country data (fallback to global average)

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Deploy dist/ folder via Netlify UI or CLI
```

### GitHub Pages

```bash
# Add to vite.config.ts:
# base: '/LifeClock/'

npm run build
# Deploy dist/ to gh-pages branch
```

## Development

### Running Tests

```bash
# Run test suite (119 tests)
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# TypeScript type check
npm run build

# Lint
npm run lint
```

### Adding More Countries

Edit `src/data/lifeExpectancy.json`:

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

## Future Enhancements

- [x] **Future Outlook**: Life milestones tracking (birthdays, summers, weekends, holidays) ✨ **NEW**
- [x] **Life Timeline**: Visual grid representation of life progress ✨ **IMPLEMENTED**
- [ ] Dark/Light theme toggle
- [ ] Statistics panel (heartbeats, breaths, etc.)
- [ ] Share functionality
- [ ] Multiple profiles
- [ ] PWA support
- [ ] Custom user-entered holidays
- [ ] Bucket list integration
- [ ] Milestone notifications

## Contributing

This is a personal project, but suggestions are welcome! Open an issue to discuss ideas.

## License

MIT License - feel free to use this code for your own projects.

## Acknowledgments

### Data Sources
- **WHO (World Health Organization)**: Life expectancy data for 100+ countries
  [WHO Global Health Observatory](https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy)

- **The Health Inequality Project**: US income-based life expectancy research
  Chetty, R., Stepner, M., Abraham, S., et al. (2016). "The Association Between Income and Life Expectancy in the United States, 2001-2014." *JAMA*, 2016. DOI: 10.1001/jama.2016.4226
  [healthinequality.org](https://healthinequality.org)

### Inspiration
- Countless life philosophy books and the fleeting nature of time

### Built With
- React 18, TypeScript 5, Vite 6, date-fns 4.1

## Author

**Sonu**
- Environment: Linux/WSL2, VSCode
- Built with: Claude Code

---

**Remember**: Every second that passes is both a loss and a gift. What will you do with yours?
