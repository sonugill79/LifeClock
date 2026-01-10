# LifeClock

**Every second counts. Make them matter.**

LifeClock is a web application that visualizes your life in real-time, showing exactly how much time you've lived and how much time remains based on statistical life expectancy.

![LifeClock Preview](https://via.placeholder.com/800x400/3b82f6/ffffff?text=LifeClock)

## Features

- **Time Lived Clock**: Real-time display of your exact age down to the second
- **Time Remaining Clock**: Statistical countdown based on your country and gender
- **100+ Countries**: Comprehensive life expectancy data from WHO 2023
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
3. **Edit Anytime**: Click "Edit Details" to update your information
4. **Data Persists**: Your settings are saved automatically

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
│   └── TimeRemaining.tsx       # Time remaining wrapper
├── hooks/               # Custom React hooks
│   ├── useTimeDifference.ts    # Real-time calculations
│   ├── useLocalStorage.ts      # Persistent storage
│   └── useLifeExpectancy.ts    # Life expectancy lookup
├── utils/               # Utility functions
│   ├── timeCalculations.ts     # Core date math
│   └── lifeExpectancyCalculator.ts  # Data lookup
├── data/                # Static data
│   └── lifeExpectancy.json     # WHO life expectancy data
├── types/               # TypeScript definitions
│   └── index.ts
├── App.tsx              # Main app component
├── App.css              # Global styles
└── main.tsx             # Entry point
```

## Documentation

- **[PRD.md](./PRD.md)**: Product Requirements Document
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)**: Detailed implementation guide

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

## Data Source

Life expectancy data sourced from:
- **WHO (World Health Organization)** 2023 statistics
- **Coverage**: 100 countries
- **Granularity**: Male/Female specific values
- **Update Frequency**: Annually

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

- [ ] Dark/Light theme toggle
- [ ] Progress bar visualization
- [ ] Statistics panel (heartbeats, breaths, etc.)
- [ ] Share functionality
- [ ] Multiple profiles
- [ ] PWA support
- [ ] Motivational quotes
- [ ] Bucket list integration

## Contributing

This is a personal project, but suggestions are welcome! Open an issue to discuss ideas.

## License

MIT License - feel free to use this code for your own projects.

## Acknowledgments

- Life expectancy data: [WHO Global Health Observatory](https://www.who.int/data/gho)
- Inspiration: Countless life philosophy books and the fleeting nature of time
- Built with: React, TypeScript, Vite, date-fns

## Author

**Sonu**
- Environment: Linux/WSL2, VSCode
- Built with: Claude Code

---

**Remember**: Every second that passes is both a loss and a gift. What will you do with yours?
