# UI/UX Development Guidelines

**Version:** 1.0
**Last Updated:** January 2025
**Source:** Consolidated from Memory Platform best practices
**Applicability:** React + Vite projects (universal UI/UX principles)

---

## Overview

This document establishes comprehensive UI/UX development standards for creating accessible, mobile-first, and user-friendly interfaces. These guidelines are framework-agnostic and apply to any React + Vite project.

**Core Values:**
- **Accessibility First**: WCAG 2.1 Level AA compliance minimum
- **Mobile First**: Design for mobile, enhance for desktop
- **Design System**: Consistent tokens and patterns
- **Component Reusability**: Build once, use everywhere
- **Performance**: Fast, responsive, optimized

---

## Table of Contents

1. [Core Design Principles](#1-core-design-principles)
2. [Design System & Tokens](#2-design-system--tokens)
3. [Layout & Responsive Design](#3-layout--responsive-design)
4. [Component Guidelines](#4-component-guidelines)
5. [Typography](#5-typography)
6. [Forms & Input](#6-forms--input)
7. [Accessibility (WCAG 2.1 AA)](#7-accessibility-wcag-21-aa)
8. [Interaction Patterns](#8-interaction-patterns)
9. [Mobile-Specific Guidelines](#9-mobile-specific-guidelines)
10. [Performance Best Practices](#10-performance-best-practices)
11. [Testing Checklist](#11-testing-checklist)
12. [Anti-Patterns](#12-anti-patterns)

---

## 1. Core Design Principles

### 1.1 Mobile-First Approach

**Principle**: Design for mobile screens first (320px-414px), then progressively enhance for larger screens.

```css
/* ✅ CORRECT: Mobile-first */
.component {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Tablet enhancement */
@media (min-width: 768px) {
  .component {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Desktop enhancement */
@media (min-width: 1024px) {
  .component {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}
```

**Why Mobile-First:**
- Majority of users access web on mobile devices
- Forces prioritization of essential features
- Easier to enhance than to strip down
- Better performance on constrained devices

### 1.2 Component Reusability

**Principle**: Before creating a new component, check if an existing component can be reused or extended.

**Decision Framework:**
```
START
  ├─ Does a component do EXACTLY what I need?
  │  └─ YES → ✅ REUSE IT
  │
  ├─ Does a component do SIMILAR things?
  │  ├─ Can I extend it with props/variants?
  │  │  └─ YES → ✅ EXTEND EXISTING
  │  └─ NO → ✅ CREATE NEW (document why)
  │
  └─ Is this a one-off special case?
     └─ YES → ✅ CREATE NEW (but design for reuse)
```

**Example: Reusable Button**
```tsx
// ✅ GOOD: Flexible, reusable
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg transition',
        variantStyles[variant],
        sizeStyles[size]
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ❌ BAD: Too specific, not reusable
function CreateMemoryButton() {
  return <button className="bg-purple-600">Create Memory</button>;
}
```

### 1.3 Design System Compliance

**Principle**: Use semantic design tokens instead of hardcoded values. This ensures:
- Dark mode works automatically
- Consistency across all pages
- Accessibility by default
- Single source of truth for design changes

```tsx
// ✅ CORRECT: Semantic tokens
<div className="bg-[var(--color-surface-default)] text-[var(--color-text-strong)]">
  <button className="bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)]">
    Click Me
  </button>
</div>

// ❌ WRONG: Hardcoded colors
<div className="bg-white text-gray-900">
  <button className="bg-purple-600 hover:bg-purple-700">
    Click Me
  </button>
</div>
```

### 1.4 Accessibility-First Mindset

**Principle**: Design for accessibility from the start, not as an afterthought.

**Key Accessibility Pillars:**
1. **Perceivable**: Users can perceive the information (contrast, alt text)
2. **Operable**: Users can operate the interface (keyboard navigation, touch targets)
3. **Understandable**: Users can understand the content (clear labels, error messages)
4. **Robust**: Content works across assistive technologies (semantic HTML, ARIA)

---

## 2. Design System & Tokens

### 2.1 Color Tokens

**Semantic Color System:**

| Category | Tokens | Usage |
|----------|--------|-------|
| **Text** | `--color-text-strong`, `--color-text-default`, `--color-text-subtle`, `--color-text-disabled`, `--color-text-inverse` | All text content |
| **Surface** | `--color-surface-canvas`, `--color-surface-default`, `--color-surface-tonal`, `--color-surface-raised` | Backgrounds, cards, panels |
| **Border** | `--color-border-default`, `--color-border-subtle`, `--color-border-strong` | Borders, dividers |
| **Action** | `--color-action-primary`, `--color-action-primary-hover`, `--color-action-primary-subtle` | Buttons, links, interactive elements |

**Example Implementation:**
```css
:root {
  /* Text colors */
  --color-text-strong: #111827;    /* Gray-900 */
  --color-text-default: #374151;   /* Gray-700 */
  --color-text-subtle: #6B7280;    /* Gray-500 */
  --color-text-disabled: #9CA3AF;  /* Gray-400 */
  --color-text-inverse: #FFFFFF;

  /* Surface colors */
  --color-surface-canvas: #F9FAFB;  /* Gray-50 */
  --color-surface-default: #FFFFFF;
  --color-surface-tonal: #F3F4F6;   /* Gray-100 */
  --color-surface-raised: #FFFFFF;

  /* Border colors */
  --color-border-default: #E5E7EB;  /* Gray-200 */
  --color-border-subtle: #F3F4F6;   /* Gray-100 */
  --color-border-strong: #D1D5DB;   /* Gray-300 */

  /* Action colors */
  --color-action-primary: #9333EA;         /* Purple-600 */
  --color-action-primary-hover: #7C3AED;   /* Purple-700 */
  --color-action-primary-subtle: #F3E8FF;  /* Purple-100 */
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-strong: #F9FAFB;
    --color-text-default: #E5E7EB;
    --color-text-subtle: #9CA3AF;
    --color-text-disabled: #6B7280;
    --color-text-inverse: #111827;

    --color-surface-canvas: #111827;
    --color-surface-default: #1F2937;
    --color-surface-tonal: #374151;
    --color-surface-raised: #1F2937;

    --color-border-default: #374151;
    --color-border-subtle: #1F2937;
    --color-border-strong: #4B5563;

    --color-action-primary: #A855F7;
    --color-action-primary-hover: #9333EA;
    --color-action-primary-subtle: #581C87;
  }
}
```

### 2.2 Typography Tokens

**Font Size Scale:**
```css
:root {
  --font-display: 36px;    /* Large headings */
  --font-h1: 32px;         /* Page titles */
  --font-h2: 24px;         /* Section headers */
  --font-h3: 20px;         /* Subsection headers */
  --font-body: 16px;       /* Body text, inputs */
  --font-caption: 14px;    /* Small text, labels */
}
```

**Font Weight Scale:**
```css
:root {
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### 2.3 Spacing Scale (4/8pt Scale)

**Use consistent spacing based on 4px and 8px increments:**

```css
:root {
  --space-1: 4px;     /* xs */
  --space-2: 8px;     /* sm */
  --space-3: 12px;    /* md-sm */
  --space-4: 16px;    /* md */
  --space-5: 20px;    /* md-lg */
  --space-6: 24px;    /* lg */
  --space-8: 32px;    /* xl */
  --space-12: 48px;   /* 2xl */
  --space-16: 64px;   /* 3xl */
}
```

**Usage:**
```css
/* ✅ GOOD: Uses spacing scale */
.card {
  padding: var(--space-4);    /* 16px */
  margin-bottom: var(--space-6); /* 24px */
}

/* ❌ BAD: Arbitrary values */
.card {
  padding: 23px;
  margin-bottom: 47px;
}
```

### 2.4 Border Radius Scale

```css
:root {
  --radius-sm: 4px;     /* Small elements */
  --radius-md: 6px;     /* Badges, small buttons */
  --radius-lg: 8px;     /* Cards, buttons */
  --radius-xl: 12px;    /* Input fields (premium feel) */
  --radius-2xl: 16px;   /* Large cards */
  --radius-full: 9999px; /* Pills, avatars */
}
```

### 2.5 Shadow Scale

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

---

## 3. Layout & Responsive Design

### 3.1 Breakpoint System

**Standard Breakpoints:**

| Name | Min Width | Target Devices |
|------|-----------|----------------|
| **xs** | 0px - 374px | Small mobile (iPhone SE) |
| **sm** | 375px - 767px | Mobile (iPhone, Android phones) |
| **md** | 768px - 1023px | Tablets (iPad) |
| **lg** | 1024px - 1279px | Small desktop / laptop |
| **xl** | 1280px+ | Large desktop |

**Tailwind CSS Breakpoints:**
```javascript
sm:   // ≥ 640px (but use 375px in custom CSS)
md:   // ≥ 768px
lg:   // ≥ 1024px
xl:   // ≥ 1280px
```

**Usage Examples:**
```jsx
// Mobile-first button sizing
<button className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
  Action
</button>

// Mobile-first typography
<h1 className="text-xl sm:text-2xl lg:text-3xl">
  Heading
</h1>

// Mobile-first grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

### 3.2 Mobile-First CSS Patterns

**Grid System:**
```css
/* Mobile-first grid */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Tablet enhancement */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Desktop enhancement */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}
```

### 3.3 Responsive Images

**Always provide multiple sizes for different densities:**

```jsx
<img
  src="/image-mobile.jpg"
  srcSet="/image-mobile.jpg 375w, /image-tablet.jpg 768w, /image-desktop.jpg 1200w"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="w-full h-auto"
  loading="lazy"
  alt="Description"
/>
```

---

## 4. Component Guidelines

### 4.1 Touch Targets (WCAG 2.5.5 Level AAA)

**Minimum Touch Target Size: 44×44 pixels**

**Applies to:**
- Buttons
- Links
- Form inputs
- Checkboxes
- Radio buttons
- Icons (interactive)

**Implementation:**
```tsx
// ✅ CORRECT: Touch-compliant input (44px height)
<input
  type="text"
  className="min-h-[44px] py-3 px-4"
/>

// ✅ CORRECT: Touch-compliant button
<button className="min-h-[44px] min-w-[44px] px-4 py-3">
  Submit
</button>

// ❌ WRONG: Too small for touch (30px height)
<input
  type="text"
  className="py-1 px-2"
/>
```

**Touch Target Spacing:**
Minimum 8px spacing between interactive elements to prevent accidental taps.

```tsx
// ✅ CORRECT: Adequate spacing
<div className="flex gap-2">  {/* 8px gap */}
  <button>Cancel</button>
  <button>Submit</button>
</div>

// ❌ WRONG: Insufficient spacing
<div className="flex gap-1">  {/* 4px gap */}
  <button>Cancel</button>
  <button>Submit</button>
</div>
```

### 4.2 State Patterns

**All interactive components should implement these states:**

| State | Visual Change | CSS Example |
|-------|--------------|-------------|
| **Default** | Base appearance | `.button { background: var(--color-action-primary); }` |
| **Hover** | Subtle highlight | `.button:hover { background: var(--color-action-primary-hover); }` |
| **Focus** | Clear outline | `.button:focus { ring: 2px var(--color-action-primary); }` |
| **Active** | Pressed appearance | `.button:active { transform: scale(0.98); }` |
| **Disabled** | Reduced opacity, no cursor | `.button:disabled { opacity: 0.5; cursor: not-allowed; }` |
| **Loading** | Spinner, disabled | `.button.loading { pointer-events: none; }` |

**Example Implementation:**
```tsx
<button
  className="
    px-4 py-3 rounded-lg min-h-[44px]
    bg-[var(--color-action-primary)]
    hover:bg-[var(--color-action-primary-hover)]
    focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-action-primary)]
    active:scale-98
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
  "
  disabled={isLoading}
>
  {isLoading ? <Spinner /> : 'Submit'}
</button>
```

---

## 5. Typography

### 5.1 Font Size Requirements

**Minimum font size: 16px for all form inputs** (prevents iOS zoom)

```tsx
// ✅ CORRECT: 16px font size
<input
  type="text"
  className="text-base"  // 16px
/>

// ❌ WRONG: 14px triggers zoom on iOS
<input
  type="text"
  className="text-sm"  // 14px
/>
```

**Exception:** Labels and helper text can be 14px since they're not inputs.

### 5.2 Line Heights

**Standard Line Heights:**

| Context | Line Height | CSS |
|---------|-------------|-----|
| **Headings** | 1.2-1.4 | `line-height: 1.2;` |
| **Body text** | 1.5-1.6 | `line-height: 1.5;` |
| **Dense content** | 1.4 minimum | `line-height: 1.4;` |

### 5.3 Font Weights

**Hierarchy through weight:**

```tsx
// Labels: Medium weight for emphasis
<label className="text-sm font-medium text-gray-700">
  Email Address
</label>

// Helper text: Regular weight
<p className="text-sm text-gray-600">
  We'll never share your email
</p>

// Error text: Medium weight for visibility
<p className="text-sm font-medium text-red-600">
  Invalid email address
</p>
```

---

## 6. Forms & Input

### 6.1 Label Requirements (WCAG 3.3.2 Level A)

**Every input MUST have a label.**

**Preferred: Visible `<label>` element**
```tsx
// ✅ BEST: Visible label with explicit association
<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
  Email Address
</label>
<input
  id="email"
  type="email"
  placeholder="your@email.com"
  className="w-full px-4 py-3 rounded-lg text-base min-h-[44px]"
/>
```

**Alternative: ARIA label (when visual label not possible)**
```tsx
// ✅ ACCEPTABLE: ARIA label for search
<input
  type="search"
  aria-label="Search"
  placeholder="Search..."
  className="w-full px-4 py-3 rounded-lg text-base min-h-[44px]"
/>
```

**❌ NEVER: Placeholder as only label**
```tsx
// ❌ WRONG: Violates WCAG 3.3.2
<input
  type="email"
  placeholder="Email Address"  // Placeholder is NOT a label
/>
```

**Why placeholders aren't labels:**
- Disappear when user types
- Low contrast (even with 4.58:1 standard)
- Not announced by all screen readers
- Confuse users about what they've entered

### 6.2 Placeholder Contrast (WCAG AA)

**Minimum Ratio: 4.5:1 for normal text**

```tsx
// ✅ CORRECT: Semantic token (4.58:1 contrast)
<input
  type="text"
  placeholder="Search..."
  className="placeholder:text-[var(--input-placeholder)]"
/>

// ❌ WRONG: Tailwind utility (may fail WCAG)
<input
  placeholder="Search..."
  className="placeholder-gray-400"
/>
```

### 6.3 Required Field Indicators

```tsx
<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
  Name <span className="text-red-600" aria-label="required">*</span>
</label>
<input
  id="name"
  type="text"
  required
  aria-required="true"
  className="w-full px-4 py-3 rounded-lg text-base min-h-[44px]"
/>
```

### 6.4 Error Handling

**WCAG 3.3.1 (Level A): Errors must be identified and described.**

```tsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

return (
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
      Email Address <span className="text-red-600" aria-label="required">*</span>
    </label>
    <input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      aria-invalid={!!error}
      aria-describedby={error ? "email-error" : undefined}
      className={`w-full px-4 py-3 rounded-lg text-base min-h-[44px] ${
        error
          ? 'border-2 border-red-600 focus:ring-red-500'
          : 'border border-gray-300 focus:ring-2 focus:ring-purple-500'
      }`}
      placeholder="your@email.com"
    />
    {error && (
      <p id="email-error" className="mt-2 text-sm text-red-600 font-medium" role="alert">
        {error}
      </p>
    )}
  </div>
);
```

**Required attributes:**
- `aria-invalid="true"` on the input
- `aria-describedby` linking to error message ID
- `role="alert"` on error message (immediate announcement)
- Visual border change (red)
- Clear, specific error text

### 6.5 Keyboard Shortcuts

**Required shortcuts:**
- `Enter`: Submit form (from any text input)
- `Escape`: Clear/cancel (for search, modal forms)
- `Space`: Activate checkboxes/radio buttons
- Arrow keys: Navigate radio button groups

```tsx
// Enter to submit
<input
  type="search"
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }}
/>

// Escape to clear
<input
  type="search"
  onKeyDown={(e) => {
    if (e.key === 'Escape') {
      e.currentTarget.value = '';
      onClear();
    }
  }}
/>
```

---

## 7. Accessibility (WCAG 2.1 AA)

### 7.1 Color Contrast Requirements

**Minimum Ratios:**
- **Normal text** (< 18px): 4.5:1
- **Large text** (≥ 18px or ≥ 14px bold): 3:1
- **UI components** (borders, icons): 3:1
- **Placeholders**: 4.5:1 (same as normal text)

**Verification:**
- Light mode: `--color-text-default` (#374151) on white = 10:1 ✅
- Placeholder: `--input-placeholder` (#7C8493) on white = 4.58:1 ✅
- Error text: Red-600 on white = 5.9:1 ✅

**Testing Tools:**
- https://contrast-ratio.com
- https://webaim.org/resources/contrastchecker/

### 7.2 Keyboard Navigation

**WCAG 2.1.1 (Level A): All functionality must be keyboard accessible**

**Requirements:**
- All inputs focusable via `Tab` key
- Tab order follows visual/logical order
- `Shift+Tab` navigates backwards
- No keyboard traps (user can always escape)

**Focus Indicators:**
```tsx
// ✅ CORRECT: Clear focus ring
<input className="focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" />

// ❌ WRONG: Focus indicator removed
<input className="outline-none" />
```

**Tab Order:**
```tsx
// ✅ CORRECT: Natural tab order
<form>
  <input type="text" name="firstName" />  {/* Tab stop 1 */}
  <input type="text" name="lastName" />   {/* Tab stop 2 */}
  <input type="email" name="email" />     {/* Tab stop 3 */}
  <button type="submit">Submit</button>   {/* Tab stop 4 */}
</form>
```

### 7.3 Screen Reader Support

**Use semantic HTML:**
```tsx
// ✅ CORRECT: Native form elements
<form onSubmit={handleSubmit}>
  <input type="email" />
  <button type="submit">Submit</button>
</form>

// ❌ WRONG: Div soup
<div onClick={handleSubmit}>
  <div className="input-like" onClick={handleInputClick} />
  <div className="button-like" onClick={handleButtonClick}>Submit</div>
</div>
```

**ARIA Attributes:**
```tsx
// Labels
aria-label="Search"
aria-labelledby="label-id"

// Descriptions
aria-describedby="helper-text-id error-message-id"

// States
aria-invalid="true"      // Field has error
aria-required="true"     // Field is required
aria-disabled="true"     // Field is disabled

// Live regions
role="alert"             // Error messages
aria-live="polite"       // Status updates
```

### 7.4 Focus Management

**Preserve focus on error:**
```tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  const errors = validateForm(formData);

  if (errors.length > 0) {
    // Focus first field with error
    const firstErrorField = document.getElementById(errors[0].fieldId);
    firstErrorField?.focus();

    setFormErrors(errors);
  } else {
    // Submit form
  }
};
```

---

## 8. Interaction Patterns

### 8.1 Hover States

**Guidelines:**
1. **Cards/Containers**: Subtle background tint appears
2. **Buttons**: Background darkens, shadow increases
3. **Links**: Color shifts, underline appears
4. **Icons**: Scale or color change

**Example:**
```tsx
<button className="
  bg-purple-600 text-white
  hover:bg-purple-700
  hover:shadow-md
  transition-all duration-200
">
  Click Me
</button>
```

### 8.2 Focus States

**Always provide clear focus indicators:**

```tsx
<input className="
  border border-gray-300
  focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
  focus:border-purple-500
  transition-all
" />
```

### 8.3 Active/Pressed States

**Provide tactile feedback:**

```tsx
<button className="
  active:scale-98
  active:shadow-sm
  transition-transform duration-100
">
  Press Me
</button>
```

### 8.4 Loading States

**Show loading state clearly:**

```tsx
<button
  disabled={isLoading}
  className="
    flex items-center gap-2
    disabled:opacity-50 disabled:cursor-not-allowed
  "
>
  {isLoading && <Spinner className="w-4 h-4 animate-spin" />}
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

### 8.5 Disabled States

**Make disabled state obvious:**

```css
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none; /* Prevents hover effects */
}
```

### 8.6 Transitions and Animations

**Keep animations smooth and purposeful:**

```css
/* ✅ GOOD: Fast, purposeful transitions */
.button {
  transition: all 200ms ease-in-out;
}

/* ❌ BAD: Slow, distracting animations */
.button {
  transition: all 1000ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

**Respect user preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Mobile-Specific Guidelines

### 9.1 iOS-Specific Considerations

**Prevent Zoom on Input Focus:**
```tsx
// ✅ CORRECT: No zoom triggered
<input
  type="text"
  className="text-base"  // 16px minimum
/>

// ❌ WRONG: Triggers zoom on focus
<input
  type="text"
  className="text-sm"  // 14px
/>
```

**Safe Area Insets:**
```css
/* Respect iOS safe areas */
.container {
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

**Safari Viewport Units:**
```css
/* Use dvh instead of vh for better support */
.full-height {
  max-height: 100dvh; /* Dynamic viewport height */
}
```

### 9.2 Android-Specific Considerations

**Chrome Address Bar Handling:**
- Use `max-h-[85vh]` to account for dynamic address bar
- Element adjusts smoothly as bar appears/disappears

**Haptic Feedback (Optional):**
```tsx
// Add vibration on important interactions
const handleImportantAction = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50); // 50ms vibration
  }
  // Proceed with action
};
```

### 9.3 Touch Gestures

**Common Gestures:**
- **Tap**: Primary interaction (like click)
- **Long press**: Show context menu or additional info
- **Swipe**: Navigate, dismiss, refresh
- **Pinch**: Zoom (images, maps)

**Example: Swipe-to-Dismiss**
```tsx
const handleTouchStart = (e: TouchEvent) => {
  touchStartY.current = e.touches[0].clientY;
};

const handleTouchMove = (e: TouchEvent) => {
  const deltaY = e.touches[0].clientY - touchStartY.current;

  // Only allow downward swipe
  if (deltaY > 0) {
    element.style.transform = `translateY(${deltaY}px)`;
  }
};

const handleTouchEnd = (e: TouchEvent) => {
  const deltaY = e.changedTouches[0].clientY - touchStartY.current;

  // Close if swiped down > 100px
  if (deltaY > 100) {
    onClose();
  } else {
    // Snap back
    element.style.transform = 'translateY(0)';
  }
};
```

### 9.4 Mobile Optimization

**Touch Manipulation:**
```css
/* Prevent double-tap zoom */
.button {
  touch-action: manipulation;
}

/* Allow horizontal scrolling only */
.horizontal-scroll {
  touch-action: pan-x;
}
```

**Input Types for Better Keyboards:**
```tsx
<input type="email" />     // Email keyboard with @
<input type="tel" />       // Numeric keyboard
<input type="url" />       // URL keyboard with .com
<input type="number" />    // Numeric keyboard with +/-
<input type="search" />    // Search keyboard with "Search" button
<input type="date" />      // Native date picker
```

---

## 10. Performance Best Practices

### 10.1 Image Optimization

**Always optimize images:**
- Use next-generation formats (WebP, AVIF)
- Provide multiple sizes for different densities
- Implement lazy loading
- Use appropriate quality settings (80-85% for photos)

```jsx
<img
  src="/image.jpg"
  srcSet="/image-mobile.jpg 375w, /image-tablet.jpg 768w, /image-desktop.jpg 1200w"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading="lazy"
  alt="Description"
/>
```

### 10.2 Bundle Size Management

**Keep JavaScript bundles small:**
- Main chunk: < 200KB
- Lazy load non-critical components
- Tree shake unused dependencies
- Code split by routes

**Example:**
```tsx
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 10.3 Lazy Loading

**Implement for all non-critical content:**
```tsx
// Images
<img loading="lazy" src="/image.jpg" alt="Description" />

// Components
const ModalDialog = lazy(() => import('./ModalDialog'));

// Routes
const AboutPage = lazy(() => import('./pages/About'));
```

### 10.4 Progressive Enhancement

**Start with functional HTML, enhance with JS:**
```tsx
// ✅ GOOD: Works without JS
<form action="/submit" method="post">
  <input name="email" type="email" required />
  <button type="submit">Subscribe</button>
</form>

// Then enhance with JS
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  // AJAX submission
};
```

---

## 11. Testing Checklist

### 11.1 Visual Testing

- [ ] Light mode appearance correct
- [ ] Dark mode appearance correct
- [ ] All hover states working
- [ ] All focus states visible
- [ ] Transitions smooth (no jank)
- [ ] Consistent spacing throughout

### 11.2 Interaction Testing

- [ ] All buttons and links work with click
- [ ] Forms submit correctly
- [ ] Keyboard navigation works completely
- [ ] Touch interactions work on mobile
- [ ] Error states display correctly

### 11.3 Responsive Testing

**Desktop Testing:**
- [ ] Layout correct at 1920px, 1440px, 1280px, 1024px
- [ ] No horizontal scrolling
- [ ] Content readable and accessible

**Tablet Testing:**
- [ ] Layout correct at 1024px, 768px
- [ ] Touch targets adequate (44x44px)
- [ ] Navigation works

**Mobile Testing:**
- [ ] Layout correct at 414px, 375px, 320px
- [ ] No horizontal scrolling
- [ ] All content visible without zooming
- [ ] Touch targets meet minimum size
- [ ] Proper spacing between elements

### 11.4 Accessibility Testing

**Automated Testing:**
- [ ] axe DevTools shows no violations
- [ ] Lighthouse accessibility score > 90

**Manual Testing:**
- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter, Escape)
- [ ] Screen reader announces correctly (VoiceOver, NVDA)
- [ ] Focus management works
- [ ] Color contrast meets WCAG AA
- [ ] All images have alt text

### 11.5 Browser/Device Testing

**Browsers:**
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS 14+)
- [ ] Mobile Chrome (Android 10+)

**Devices:**
- [ ] iPhone SE (small mobile)
- [ ] iPhone 14 (standard mobile)
- [ ] iPad (tablet)
- [ ] Desktop (1440px+)

### 11.6 Performance Testing

- [ ] Page loads under 3 seconds on 3G
- [ ] Images load progressively
- [ ] No layout shifts during loading (CLS < 0.1)
- [ ] Smooth scrolling and animations (60fps)
- [ ] Bundle size acceptable (< 200KB main chunk)

---

## 12. Anti-Patterns

### 12.1 Hardcoded Colors

**❌ WRONG:**
```tsx
<div className="text-gray-900 bg-purple-600">
  Content
</div>
```

**✅ CORRECT:**
```tsx
<div className="text-[var(--color-text-strong)] bg-[var(--color-action-primary)]">
  Content
</div>
```

### 12.2 Placeholder as Only Label

**❌ WRONG:**
```tsx
<input
  type="email"
  placeholder="Email Address"  // Violates WCAG
/>
```

**✅ CORRECT:**
```tsx
<label htmlFor="email" className="block text-sm font-medium mb-2">
  Email Address
</label>
<input
  id="email"
  type="email"
  placeholder="your@email.com"
/>
```

### 12.3 Poor Placeholder Contrast

**❌ WRONG:**
```tsx
<input
  placeholder="Search..."
  className="placeholder-gray-400"  // May fail WCAG
/>
```

**✅ CORRECT:**
```tsx
<input
  placeholder="Search..."
  className="placeholder:text-[var(--input-placeholder)]"  // 4.58:1 contrast
/>
```

### 12.4 Small Touch Targets

**❌ WRONG:**
```tsx
<input className="py-1 px-2" />  // ~30px height
```

**✅ CORRECT:**
```tsx
<input className="py-3 px-4 min-h-[44px]" />  // 44px minimum
```

### 12.5 Missing Error Context

**❌ WRONG:**
```tsx
<input className="border-red-600" />  // Visual only, no ARIA
{error && <p className="text-red-600">{error}</p>}
```

**✅ CORRECT:**
```tsx
<input
  aria-invalid="true"
  aria-describedby="email-error"
  className="border-red-600"
/>
{error && (
  <p id="email-error" role="alert" className="text-red-600">
    {error}
  </p>
)}
```

### 12.6 No Focus Indicator

**❌ WRONG:**
```tsx
<input className="outline-none" />  // Focus indicator removed
```

**✅ CORRECT:**
```tsx
<input className="focus:ring-2 focus:ring-purple-500" />  // Clear focus ring
```

### 12.7 Arbitrary Spacing

**❌ WRONG:**
```tsx
<div className="p-[23px] m-[47px]">
  Content
</div>
```

**✅ CORRECT:**
```tsx
<div className="p-4 m-6">  {/* 16px, 24px from spacing scale */}
  Content
</div>
```

---

## Resources

### Testing Tools
- **Contrast Checker**: https://contrast-ratio.com
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **axe DevTools**: Browser extension for automated accessibility testing
- **Lighthouse**: Built into Chrome DevTools

### Screen Readers
- **NVDA** (Windows): https://www.nvaccess.org/
- **VoiceOver** (macOS/iOS): Built-in
- **JAWS** (Windows): https://www.freedomscientific.com/products/software/jaws/

### Documentation
- **WCAG 2.1 Quick Reference**: https://www.w3.org/WAI/WCAG21/quickref/
- **Form Accessibility Guide**: https://www.w3.org/WAI/tutorials/forms/
- **Mobile Web Best Practices**: https://www.w3.org/TR/mobile-bp/

---

## Conclusion

These guidelines ensure accessible, mobile-first, and user-friendly interfaces across all projects. All developers and designers should reference this document when building UI components.

**Remember:**
- **Accessibility First**: Build for everyone from the start
- **Mobile First**: Design for smallest screen, enhance upward
- **Design Tokens**: Use semantic tokens, not hardcoded values
- **Component Reuse**: Check existing components before creating new ones
- **Test Thoroughly**: Validate across devices, browsers, and assistive technologies

---

**Version:** 1.0
**Last Updated:** January 2025
**Maintained by:** Development Team
**Questions?** Create an issue or discuss in team meetings
