# AI Execution Prompt - Future Outlook Feature

**Version:** 1.0
**Created:** 2026-01-12
**Status:** Ready for Execution

---

## Quick Context

You are implementing the **Future Outlook** feature for LifeClock, a privacy-first web app that visualizes life in real-time. This feature adds life milestone tracking (birthdays, summers, weekends, holidays) to inspire users to make the most of their finite time.

---

## Your Mission

Implement the Future Outlook feature following the detailed implementation plan. Work systematically through each phase, marking tasks as complete, and documenting your progress.

---

## Required Reading (In Order)

**Before you start, read these documents:**

1. **`CLAUDE.md`** - Understand the existing codebase architecture and patterns
2. **`PRD_FUTURE_OUTLOOK.md`** - Understand what you're building and why
3. **`IMPLEMENTATION_FUTURE_OUTLOOK.md`** - Your detailed task-by-task guide

---

## How to Execute

### Step 1: Orient Yourself

Read the three documents above to understand:
- How LifeClock currently works
- What Future Outlook should do
- How to implement it step-by-step

### Step 2: Find Your Starting Point

Open `IMPLEMENTATION_FUTURE_OUTLOOK.md` and locate:
- The "Current Phase" marker at the top
- The next task with status `[ ]` (pending)
- If all Phase 0 tasks are incomplete, start with Phase 0, Task 0.1

### Step 3: Execute Tasks Systematically

For each task:

1. **Mark it in-progress:**
   - Change `[ ]` to `[>]` in the implementation plan
   - Update the markdown file

2. **Read the task details:**
   - Understand what to create/modify
   - Review acceptance criteria
   - Check code examples provided

3. **Implement the task:**
   - Create/modify files as specified
   - Follow existing codebase patterns (from CLAUDE.md)
   - Write clean, well-commented code
   - Use TypeScript strict mode

4. **Validate your work:**
   - Run acceptance criteria checks
   - Test the functionality
   - Verify no TypeScript errors: `npx tsc -b`
   - Check for console errors: `npm run dev`

5. **Mark it complete:**
   - Change `[>]` to `[x]` in the implementation plan
   - Add any notes about your implementation
   - Document any deviations from the plan

6. **Move to next task:**
   - Proceed to the next `[ ]` task in sequence
   - Don't skip tasks unless explicitly marked `[-]` (skipped)

### Step 4: Phase Completion

When you complete a phase:
- Review all tasks in that phase are marked `[x]`
- Run any phase-specific validation
- Update the "Current Phase" marker at the top of the implementation plan
- Document any issues or insights in "Implementation Notes"

### Step 5: Regular Updates

Update the implementation plan regularly:
- Mark tasks as you complete them
- Document test results in designated sections
- Note any deviations or issues
- Update "Last Updated" timestamp

---

## Important Guidelines

### Code Quality
- **Follow existing patterns:** Study how components, hooks, and utils are structured
- **TypeScript strict mode:** All code must be properly typed
- **No console.log:** Remove debug logs before marking task complete
- **Error handling:** Gracefully handle edge cases
- **Performance:** Use memoization, avoid unnecessary re-renders

### Testing
- **Test as you go:** Don't wait until the end
- **Validate each task:** Check acceptance criteria before moving on
- **Manual testing required:** Run the app and interact with your work
- **Document issues:** Note any bugs in the test results section

### Documentation
- **Comment your code:** Explain complex logic
- **Update plan:** Mark tasks complete, add notes
- **Record decisions:** Document any deviations from the plan
- **Fill in test results:** Complete test sections as you validate

### Communication
- **Ask questions:** If requirements are unclear, ask Sonu
- **Propose improvements:** If you see better approaches, suggest them
- **Report blockers:** If stuck, document in implementation plan with `[!]` status
- **Share insights:** Document lessons learned for future work

---

## Task Status Legend

Use these statuses in the implementation plan:

- `[ ]` **Pending** - Not started yet
- `[>]` **In Progress** - Currently working on this
- `[x]` **Completed** - Done and validated
- `[!]` **Blocked** - Cannot proceed, needs resolution
- `[-]` **Skipped** - Decided not to implement

**Rule:** Only ONE task should be `[>]` at a time (the one you're currently working on).

---

## Workflow Example

Here's how a typical work session should look:

```markdown
**Session Start:**
1. Read IMPLEMENTATION_FUTURE_OUTLOOK.md
2. Find next pending task: Phase 1, Task 1.1 "Define TypeScript Types"
3. Mark task [>] in the implementation plan
4. Update markdown file

**During Work:**
5. Create src/types/milestones.ts
6. Define all required types per the specification
7. Add JSDoc comments
8. Run npx tsc -b to verify no errors
9. Review acceptance criteria - all met ✓

**Task Complete:**
10. Mark task [x] in the implementation plan
11. Add note: "All types defined, compiled without errors"
12. Commit: "feat: add milestone type definitions"
13. Move to next task: Phase 1, Task 1.2

**End of Session:**
14. Update "Last Updated" timestamp
15. Document progress in Implementation Notes
16. Commit all work with clear message
```

---

## Key Files You'll Create

You'll be creating these files as part of the implementation:

```
src/
├── types/
│   └── milestones.ts                          [Phase 1.1]
├── data/
│   └── holidays.json                          [Phase 1.2]
├── utils/
│   ├── milestoneCalculations.ts              [Phase 2.1-2.6]
│   └── holidayCalculations.ts                [Phase 2.4]
├── hooks/
│   ├── useMilestones.ts                      [Phase 3.5]
│   └── useFutureOutlookStorage.ts            [Phase 1.4]
└── components/
    └── FutureOutlook/
        ├── index.ts                          [Phase 3.6]
        ├── FutureOutlook.tsx                 [Phase 3.3]
        ├── FutureOutlook.module.css          [Phase 3.4]
        ├── MilestoneCard.tsx                 [Phase 3.1]
        ├── MilestoneCard.module.css          [Phase 3.2]
        ├── MilestoneConfig.tsx               [Phase 4.1]
        └── MilestoneConfig.module.css        [Phase 4.2]
```

---

## Commands You'll Use Frequently

```bash
# Development server
npm run dev

# Type checking (run often!)
npx tsc -b

# Production build (test at end)
npm run build

# Preview production build
npm run preview

# Check git status
git status

# Commit progress
git add .
git commit -m "feat: [description]"

# View current branch
git branch
```

---

## Success Criteria

You'll know you're done when:

- ✅ All tasks in Phases 0-6 are marked `[x]`
- ✅ Feature works end-to-end without errors
- ✅ TypeScript compiles without errors (`npx tsc -b`)
- ✅ App runs without console errors/warnings
- ✅ All acceptance criteria met for each task
- ✅ Manual testing completed and documented
- ✅ Test results sections filled in
- ✅ Documentation updated (CLAUDE.md, README.md)
- ✅ Production build works (`npm run build && npm run preview`)

---

## Getting Help

**If you encounter issues:**

1. **Check the PRD:** Is your understanding correct?
2. **Check existing code:** How do similar features work?
3. **Check the plan:** Are there notes or examples?
4. **Document the blocker:** Mark task `[!]` and explain the issue
5. **Ask Sonu:** Request clarification or guidance

**Common Issues:**

- **TypeScript errors:** Check type definitions match exactly
- **Import errors:** Verify file paths and exports
- **CSS not applying:** Check module.css import and className usage
- **State not updating:** Check if using hooks correctly
- **LocalStorage not persisting:** Verify key name and JSON structure

---

## Phase Overview

Quick reference of what each phase accomplishes:

- **Phase 0: Setup** (30 mins) - Understand codebase, create file structure
- **Phase 1: Infrastructure** (2-3 hrs) - Types, data, storage hooks
- **Phase 2: Calculations** (3-4 hrs) - All milestone math and logic
- **Phase 3: UI Components** (4-5 hrs) - React components and styling
- **Phase 4: Configuration** (3-4 hrs) - Settings panel and user preferences
- **Phase 5: Integration** (2-3 hrs) - Connect to app, edge cases, polish
- **Phase 6: Testing** (2 hrs) - Comprehensive testing and documentation

**Total: 16-21 hours of focused work**

---

## Final Checklist

Before marking the feature complete:

- [ ] All 50+ tasks marked `[x]`
- [ ] Feature works perfectly in browser
- [ ] No TypeScript errors
- [ ] No console errors/warnings
- [ ] Mobile responsive (test multiple sizes)
- [ ] Accessible (keyboard navigation works)
- [ ] Performance is good (no lag)
- [ ] LocalStorage persists correctly
- [ ] Edge cases handled gracefully
- [ ] Documentation updated
- [ ] Test results documented
- [ ] Production build tested
- [ ] Code is clean and commented

---

## Ready to Start?

**Your first action:**

1. Open `IMPLEMENTATION_FUTURE_OUTLOOK.md`
2. Go to Phase 0, Task 0.1
3. Mark it `[>]` (in progress)
4. Begin reading the specified files

**Good luck! Build something awesome! 🚀**

---

## Quick Tips

💡 **Work systematically** - Don't skip ahead, phases build on each other
💡 **Test frequently** - Catch issues early, not at the end
💡 **Commit often** - Small, focused commits make debugging easier
💡 **Document everything** - Future you (or another AI) will thank you
💡 **Ask when stuck** - Blocked for >30 mins? Document and ask for help
💡 **Follow patterns** - Study existing code, match the style
💡 **Think about UX** - Make it intuitive, accessible, and delightful

---

**Now go execute! The implementation plan has everything you need.** 📋✨
