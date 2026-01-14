# Privacy Policy

**Effective Date:** 2026-01-13
**Last Updated:** 2026-01-13
**Version:** 2.0

---

## TL;DR

**Your data never leaves your device. Period.**

LifeClock stores everything in your browser's localStorage. No servers, no tracking, no analytics, no external API calls (after initial data files load). You have complete control.

---

## What Data We Collect

### Data You Provide

When you use LifeClock, you enter:
- **Date of birth** (to calculate time lived/remaining)
- **Gender** (male/female/other - for life expectancy lookup)
- **Country** (for WHO life expectancy data)
- **Household income** (optional, US users only - for income-based estimates)

### Data We Generate

Based on your input, we calculate and store:
- **Life expectancy estimate** (from WHO or income data)
- **Timeline preferences** (years/months/weeks view)
- **Theme selection** (chosen color scheme)
- **Future outlook preferences** (selected milestones/holidays)
- **Last updated timestamp** (when you last edited your profile)

---

## Where Your Data Is Stored

### localStorage Only

**ALL data stays in your browser's localStorage.**

```
Stored Keys:
- lifeclock-user-data        (birthday, gender, country, income)
- lifeclock-theme            (theme preference)
- lifeclock-timeline-granularity  (timeline view mode)
- lifeclock-timeline-icon-style   (icon style)
- lifeclock-future-outlook   (selected milestones)
```

**What this means:**
- ✅ Data stored on YOUR device only
- ✅ No servers involved
- ✅ No cloud sync
- ✅ No external databases
- ✅ Completely offline after initial load

**Verification:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh LifeClock
4. See ZERO requests after initial CSS/JS/data files load

---

## What We DON'T Do

### ❌ No Servers
- LifeClock has no backend
- No user accounts
- No authentication
- No data collection endpoints

### ❌ No Tracking
- No Google Analytics
- No Facebook Pixel
- No third-party analytics
- No cookies (except localStorage)
- No fingerprinting

### ❌ No External Requests
- No API calls (after data files load)
- No telemetry
- No error reporting to external services
- No "phone home" functionality

### ❌ No Data Sharing
- No data ever sent to us
- No data shared with third parties
- No data sold or monetized
- No marketing emails (we don't have your email!)

---

## Income Data Privacy

### US Income-Based Feature (NEW - 2026)

When you provide household income:

**What happens:**
- Income converted to percentile (1st-100th) in your browser
- Percentile used to lookup life expectancy from local CSV file
- Both values stored in localStorage (on YOUR device)

**What DOESN'T happen:**
- ❌ Income NOT sent to any server
- ❌ Income NOT stored in any database
- ❌ Income NOT shared with anyone
- ❌ Income NOT used for analytics

**"Other" Gender Handling:**
- Income data averaged from male/female values
- No gender assignment forced
- Calculation happens locally
- Nothing sent externally

---

## Data Control

### You Own Your Data

**Edit Anytime:**
- Click Settings (gear icon)
- Update any field
- Changes save immediately to localStorage

**Delete Anytime:**
- Clear localStorage in browser settings
- Or: Delete site data for http://localhost:5173 (or your domain)
- Or: Use Incognito/Private mode (data clears on close)

**Export:**
- Currently: Manual (copy from DevTools localStorage)
- Future: May add JSON export feature

---

## Browser Permissions

### What We Request

**localStorage Access:**
- **Why:** Store your data locally
- **Required:** Yes (app won't work without it)
- **Alternatives:** None (privacy-first design requires local storage)

**No Other Permissions:**
- ❌ No location access
- ❌ No camera/microphone
- ❌ No contacts/calendar
- ❌ No notifications
- ❌ No clipboard

---

## Cross-Tab Sync

### How It Works

LifeClock syncs across tabs in the SAME browser using localStorage `storage` events.

**What this means:**
- ✅ Change theme in Tab 1 → updates Tab 2
- ✅ All tabs on YOUR device stay in sync
- ❌ Different browsers: No sync (data stays in each browser)
- ❌ Different devices: No sync (no cloud)

**Privacy:** This is local sync only. No network involved.

---

## Security

### Client-Side Only Architecture

**Threat Model:**
- ✅ Protected from server breaches (no server!)
- ✅ Protected from database leaks (no database!)
- ✅ Protected from man-in-the-middle attacks (no data transmission!)
- ⚠️ Vulnerable to local device access (someone with your laptop)

**Best Practices:**
- Use strong device password/PIN
- Don't share your device with untrusted parties
- Use Incognito mode on shared computers
- Clear localStorage when using public computers

### HTTPS

**Production Deployment:**
- ✅ Always use HTTPS for production
- ✅ Prevents network eavesdropping
- ✅ Ensures data file integrity

---

## Legal Compliance

### GDPR (EU)

**Data Controller:** You (the user)
- ✅ All data stored on YOUR device
- ✅ No data processing by us
- ✅ No data transfers
- ✅ Right to deletion (just clear localStorage)
- ✅ Right to access (view in DevTools)
- ✅ Right to portability (copy localStorage JSON)

### CCPA (California)

**No "Sale" of Data:**
- ✅ We don't collect your data
- ✅ We don't sell your data
- ✅ We don't share your data with third parties

### HIPAA (Health Data)

**Not Covered:**
- Life expectancy estimates are NOT medical records
- LifeClock is a mindfulness tool, not healthcare app
- No PHI (Protected Health Information) collected

---

## Changes to This Policy

### How We Update

**If we change this policy:**
1. Update version number at top
2. Update "Last Updated" date
3. List changes in version history
4. (Optional) Show notice on app load

**Major changes** (affecting data collection):
- Require explicit user consent
- Provide opt-out mechanism

**Minor changes** (clarifications):
- Updated immediately
- No action required

---

## Children's Privacy

### Age Requirements

**No Minimum Age:**
- LifeClock is safe for all ages
- No account creation
- No data collection

**Parental Control:**
- Parents can monitor localStorage
- Parents can delete data anytime
- No hidden functionality

---

## Third-Party Services

### Data Files (Initial Load Only)

**On first visit, we load:**
- WHO life expectancy data (JSON file, static)
- Income data CSV (static file, 15KB)
- CSS/JS application files

**After initial load:**
- ❌ No further requests
- ❌ No CDNs for fonts (self-hosted)
- ❌ No external images

### External Links

**Data source badges link to:**
- healthinequality.org (income research)
- who.int (WHO data source)

**Privacy:** Clicking links opens external sites (subject to their privacy policies)

---

## Contact

### Questions or Concerns?

**Found a privacy issue?**
- Open GitHub issue (if public repo)
- Or: Contact via project maintainer

**Want to verify our privacy claims?**
- ✅ Inspect source code (open source)
- ✅ Check Network tab (see zero requests)
- ✅ Review localStorage (see your data only)

---

## Transparency Commitment

### Our Promise

**We commit to:**
- ✅ Never adding analytics without disclosure
- ✅ Never adding backend services without disclosure
- ✅ Never collecting data without explicit consent
- ✅ Maintaining privacy-first architecture

**If we ever change our model:**
- Must update this policy
- Must provide opt-out
- Must give advance notice

---

## Summary

| Question | Answer |
|----------|--------|
| **Where is my data?** | Your device only (localStorage) |
| **Who has access?** | Only you (no servers involved) |
| **Is it encrypted?** | Browser handles encryption at rest |
| **Can I delete it?** | Yes, anytime (clear localStorage) |
| **Do you track me?** | No, zero analytics |
| **Is it sold?** | No, we never see your data |
| **GDPR compliant?** | Yes (no data leaves device) |
| **Is income data safe?** | Yes (never sent externally) |

---

**Last Review Date:** 2026-01-13

**Version History:**
- v2.0 (2026-01-13): Added income data privacy section
- v1.0 (2025): Initial privacy policy
