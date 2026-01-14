# LifeClock Methodology

**Last Updated:** 2026-01-13
**Version:** 2.0 (Income-based life expectancy feature added)

---

## Overview

LifeClock provides real-time life expectancy estimates using statistical data from trusted health organizations. Our methodology prioritizes accuracy, transparency, and privacy.

---

## Data Sources

### 1. World Health Organization (WHO) Country Data

**Source:** WHO Global Health Observatory (GHO)
**Data Year:** 2023
**Coverage:** 100+ countries

**What it provides:**
- Life expectancy at birth by country
- Gender-specific estimates (male, female, combined average)
- Based on population-level mortality data

**Limitations:**
- Does not account for socioeconomic factors
- Country-level averages may not reflect individual circumstances
- Does not adjust for lifestyle, genetics, or access to healthcare

**When we use it:**
- Default for all users
- Only source for non-US countries
- Fallback when income data unavailable

---

### 2. US Income-Based Life Expectancy (NEW - 2026)

**Source:** The Health Inequality Project
**Research:** Chetty et al. (2016)
**Data:** 1.4 billion tax records paired with Social Security mortality data
**Coverage:** United States only

**What it provides:**
- Life expectancy estimates based on household income percentile (1st-100th)
- Gender-specific estimates (male, female, averaged for "other")
- Income data measured at age 40
- Significantly more accurate than country averages for US residents

**How it works:**
1. User provides household income as dollar amount ($0-$2M)
2. System converts income to percentile using gender-specific income distribution
3. Life expectancy retrieved from dataset for that percentile
4. Displayed alongside WHO country estimate for comparison

**Key Findings:**
- Income affects US life expectancy by up to 14.6 years
- Higher income correlates with longer life expectancy
- Effect persists across all income levels (not just extremes)

**Limitations:**
- US-only (dataset covers American population)
- Income measured at age 40 (used for all ages as best estimate)
- Does not account for lifestyle changes, genetics, or healthcare access beyond income proxy
- "Other" gender uses averaged male/female data (dataset only includes binary genders)

**When we use it:**
- US users who provide household income
- Automatically upgrades estimate from WHO country average

---

## Calculation Methodology

### For Non-US Users or US Users Without Income Data

```
Life Expectancy = WHO Country Data (based on country + gender)
```

**Example:**
- User: 35-year-old female in Canada
- WHO Canada Female Life Expectancy: 84.1 years
- LifeClock displays: 84.1 years

---

### For US Users With Income Data

```
Life Expectancy = Health Inequality Project Data (based on income percentile + gender)
```

**Example:**
- User: 35-year-old male in US, $75k household income
- Income → 62nd percentile (male income distribution)
- Life Expectancy (62nd %ile, male): 82.3 years
- WHO US Male average for comparison: 76.3 years
- **Improvement:** +6.0 years more accurate estimate

---

### Gender Handling

#### For "Male" and "Female"
- Direct lookup from respective datasets
- No averaging or adjustment

#### For "Other" / Non-Binary
- **WHO Country Data:** Uses "Both" combined average
- **Income Data:** Averages male and female values for same percentile
  - Example: 50th percentile
    - Male: 81.59 years
    - Female: 84.98 years
    - **Other: 83.29 years** (average)
- **Rationale:** Most respectful approach given dataset limitations. Provides income-based accuracy without forcing gender assignment.

---

## Privacy & Data Handling

### What We DON'T Do ❌
- No backend servers
- No external API calls (except for initial data files)
- No analytics or tracking
- No cookies (except localStorage for your data)
- No third-party integrations
- No data ever leaves your device

### What We DO ✅
- Store all data in browser localStorage only
- Keep data on YOUR device exclusively
- Provide full control (edit/delete anytime)
- Maintain complete transparency about calculations

**You can verify:** Open browser DevTools → Network tab → See zero requests after initial load

---

## Accuracy & Disclaimers

### What Life Expectancy Means

**Life expectancy is a statistical average**, not a prediction for any individual.

It represents:
- How long a population group (country, income level, gender) lives on average
- Based on current mortality rates
- Assumes conditions remain constant

It does NOT account for:
- Your personal health history
- Lifestyle factors (exercise, diet, smoking, etc.)
- Genetics and family history
- Access to quality healthcare
- Future medical advances
- Individual circumstances

### Variance

Individual outcomes vary widely:
- Some live decades beyond expectancy
- Others experience shorter lives
- Statistical range is 70-100+ years for most groups
- Income data shows ~15-20 year spread within populations

### Intended Use

LifeClock is designed to:
- ✅ Inspire mindfulness about time
- ✅ Encourage living intentionally
- ✅ Visualize life's finite nature
- ✅ Motivate making moments count

LifeClock is NOT:
- ❌ Medical advice
- ❌ A prediction of your actual lifespan
- ❌ Suitable for making health/financial decisions
- ❌ A replacement for professional consultation

---

## Research Citations

### WHO Data
- **Source:** WHO Global Health Observatory
- **URL:** https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy
- **Accessed:** 2023

### Income-Based Data
- **Research Paper:** "The Association Between Income and Life Expectancy in the United States, 2001-2014"
- **Authors:** Chetty, R., Stepner, M., Abraham, S., et al.
- **Published:** JAMA, 2016
- **DOI:** 10.1001/jama.2016.4226
- **Dataset:** The Health Inequality Project
- **URL:** https://healthinequality.org
- **Coverage:** 1.4 billion tax records, 2001-2014

---

## Technical Implementation

### CSV Parser
- **Custom lightweight parser** (~0.5KB)
- **Why not PapaParse?** Aligns with "keep bundle small" principle (saves 7.5KB)
- **Reliability:** Dataset is well-formed, controlled, and validated

### Performance
- **CSV Load Time:** <50ms (one-time at app initialization)
- **Income Lookup:** <1ms (O(1) Map cache)
- **Real-time Updates:** Every 1 second
- **Bundle Impact:** +15KB for CSV data, +3KB for utilities

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires localStorage support
- Works offline after initial load

---

## Version History

### Version 2.0 (2026-01-13)
- ✨ **NEW:** Income-based life expectancy for US users
- ✨ **NEW:** Dollar amount income input with percentile conversion
- ✨ **NEW:** Live preview showing estimate improvement
- ✨ **NEW:** Data source transparency badge with WHO comparison
- 🔒 Maintained privacy-first architecture (no backend)

### Version 1.0 (2025)
- Initial release
- WHO country data (100+ countries)
- Time clocks (lived/remaining)
- Life timeline visualization
- Future outlook (birthdays, seasons, weekends, holidays)

---

## Questions or Concerns?

**Found an issue?** Open a GitHub issue at: [Repository URL]

**Privacy questions?** See PRIVACY.md

**Want to contribute?** See CONTRIBUTING.md (if available)

---

**Remember:** LifeClock is a mindfulness tool, not a medical prediction. Every moment is precious—make yours count.
