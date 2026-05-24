# UAT Testing Report

**Date:** 2026-05-24
**Application:** https://movielist-henna.vercel.app
**Tested By:** Claude (automated UAT via Playwright)
**Overall Status:** CONDITIONAL PASS

---

## Summary

| Total Tests | Passed | Failed | Blocked |
|-------------|--------|--------|---------|
| 13          | 12     | 1      | 0       |

**Overall Status Criteria:**
- **PASS** — all tests passed
- **CONDITIONAL PASS** — minor failures that do not block release; failures documented below
- **FAIL** — one or more critical failures; release not recommended until resolved

---

## Test Results

### TC-001: Page loads successfully

**Feature:** App loads without errors and renders all key UI elements
**Pre-condition:** Fresh browser session
**Result:** ✅ PASS

**Steps Executed:**
1. Navigate to https://movielist-henna.vercel.app

**Expected Result:** Page title "Reel — Movie & TV Tracker" visible; header, nav buttons (List/Stats), Add button, status filter tabs, and sort dropdown all present
**Actual Result:** All elements rendered correctly. Page title confirmed. Status tabs show All/Watched/Want to Watch/Currently Watching with counts.
**Evidence:** Snapshot showed full page structure including `heading "Reel"`, `button "+ Add"`, all 4 filter tab buttons, and sort combobox with 5 options.

---

### TC-002: Add a Movie entry (happy path)

**Feature:** Add entries — manually enter title, year, genre, type, status, watch date, rating, and notes
**Pre-condition:** App loaded, list is empty
**Result:** ✅ PASS

**Steps Executed:**
1. Click "+ Add" button
2. Fill in: Title = "Blade Runner 2049", Type = Movie, Status = Watched, Year = 2017, Genre = Sci-Fi, Rating = 9
3. Click "Save Entry"

**Expected Result:** Modal closes, entry appears in list with all fields displayed; tab count increments
**Actual Result:** Entry "Blade Runner 2049" appeared on the card with ★9/10, Movie, Watched, 2017, Sci-Fi. "Entry added" toast shown. All tab: 1, Watched: 1.
**Evidence:** Snapshot after save showed the entry card with correct all fields and `generic: Entry added` toast.

---

### TC-003: Add a TV Show entry

**Feature:** Add entries — type TV Show
**Pre-condition:** List has 1 entry
**Result:** ✅ PASS

**Steps Executed:**
1. Click "+ Add"
2. Fill in: Title = "Breaking Bad", Type = TV Show, Status = Watched, Year = 2008, Genre = Drama, Rating = 10
3. Click "Save Entry"

**Expected Result:** Entry appears with "TV Show" label
**Actual Result:** "Breaking Bad" card displayed with ★10/10, TV Show label, Watched, 2008, Drama.
**Evidence:** Snapshot showed `generic: TV Show` label on the card. All: 2, Watched: 2.

---

### TC-004: Add entry — title required validation

**Feature:** Title is required field; submission without title blocked
**Pre-condition:** Add modal open
**Result:** ✅ PASS

**Steps Executed:**
1. Click "+ Add"
2. Leave title empty
3. Click "Save Entry"

**Expected Result:** Validation error shown, modal stays open, no entry added
**Actual Result:** Modal remained open. Inline error message "Title is required." appeared above the form. Entry count stayed at 2.
**Evidence:** Snapshot showed `generic [ref=e121]: Title is required.` inside the modal, list counts unchanged.

---

### TC-005: Status filter tabs

**Feature:** Browse list — filter by All / Watched / Want to Watch / Currently Watching
**Pre-condition:** List has 4 entries across all three statuses (2 Watched, 1 Want to Watch, 1 Currently Watching)
**Result:** ✅ PASS

**Steps Executed:**
1. Click "Watched" tab — verify only Watched entries shown
2. Click "Want to Watch" tab — verify only Want to Watch entries shown
3. Click "Currently Watching" tab — verify only Currently Watching entries shown

**Expected Result:** Each tab filters list to matching entries only; active tab highlighted
**Actual Result:** Watched tab: showed Breaking Bad and Blade Runner 2049 only. Currently Watching tab: showed Shogun only. Want to Watch tab: showed Dune Part Two only. Active state applied to selected tab.
**Evidence:** Each tab snapshot confirmed correct filtering; `[active]` attribute on selected button.

---

### TC-006: Sort dropdown — Title A–Z

**Feature:** Sort options — alphabetically by title
**Pre-condition:** All 4 entries visible
**Result:** ✅ PASS

**Steps Executed:**
1. Select "Title (A–Z)" from sort dropdown

**Expected Result:** Entries reorder alphabetically ascending
**Actual Result:** Order became: Blade Runner 2049 → Breaking Bad → Dune Part Two → Shogun. Correct alphabetical order.
**Evidence:** Snapshot confirmed the exact ordering matching A–Z sort.

---

### TC-007: Edit an entry

**Feature:** Edit & delete entries — update any field
**Pre-condition:** At least one entry in the list
**Result:** ✅ PASS

**Steps Executed:**
1. Click "Edit" on Blade Runner 2049
2. Change rating from 9 to 8
3. Add notes: "Visually stunning, great world-building"
4. Click "Save Changes"

**Expected Result:** Modal closes, card updates with new rating and notes; "Entry updated" toast shown
**Actual Result:** Card immediately showed ★8/10 and notes text. Modal titled "Edit Entry" opened with all fields pre-populated correctly. "Entry updated" toast confirmed.
**Evidence:** Snapshot showed `generic: ★ 8/10` and `generic: Visually stunning, great world-building` on the updated card.

---

### TC-008: Delete an entry with confirmation

**Feature:** Edit & delete entries — remove an entry from the list
**Pre-condition:** "Dune Part Two" entry exists
**Result:** ✅ PASS

**Steps Executed:**
1. Click "Delete" on Dune Part Two
2. Accept browser confirm dialog: "Delete 'Dune Part Two'? This cannot be undone."

**Expected Result:** Entry removed from list; counts updated; "Entry deleted" toast shown
**Actual Result:** Native browser confirm dialog appeared with the correct message. After accepting, entry was removed. All count dropped from 4 to 3, Want to Watch dropped to 0. "Entry deleted" toast shown.
**Evidence:** Snapshot confirmed entry absent from list, `generic: Entry deleted` toast, and `button "Want to Watch 0"` count.

---

### TC-009: Stats view

**Feature:** Stats & insights — total watched, avg rating, movie/show split, genre breakdown, watches per month/year
**Pre-condition:** 3 entries in list (2 Watched, 1 Currently Watching)
**Result:** ✅ PASS

**Steps Executed:**
1. Click "Stats" in nav
2. Verify all stat panels render with correct data

**Expected Result:** Shows total watched: 2, avg rating: 9.0, movies: 1, TV shows: 1, genres listed, monthly breakdown
**Actual Result:** Stats showed Total Watched: 2, Avg Rating: 9.0 (correct: (8+10)/2), Want to Watch: 0, Currently Watching: 1, Movies: 1, TV Shows: 1, Top Genres: Drama 1 / Sci-Fi 1, Watched per Year 2026: 2, May: 2.
**Evidence:** Full stats panel rendered with all sections present and mathematically correct values.

---

### TC-010: Sort by Rating (high–low)

**Feature:** Sort options — by rating descending
**Pre-condition:** List has entries with different ratings (including one unrated)
**Result:** ✅ PASS

**Steps Executed:**
1. Select "Rating (high–low)" from sort dropdown

**Expected Result:** Highest rated entries appear first; unrated entries last
**Actual Result:** Breaking Bad ★10/10 → Blade Runner 2049 ★8/10 → Shogun (no rating, last). Correct descending order with unrated at bottom.
**Evidence:** Snapshot confirmed order matching rating_desc sort.

---

### TC-011: Console error check

**Feature:** App should load without functional JavaScript errors
**Pre-condition:** Full session of interactions completed
**Result:** ✅ PASS

**Steps Executed:**
1. Retrieve all console errors logged during the session

**Expected Result:** No functional JavaScript errors
**Actual Result:** Only 1 error found: `Failed to load resource: 404 @ /favicon.ico`. This is a missing favicon asset — cosmetic only, no functional impact.
**Evidence:** `browser_console_messages` returned 1 error total: the favicon 404. No JS runtime errors.

---

### TC-012: Responsive layout — mobile viewport

**Feature:** Responsive — works well on phone (375px width)
**Pre-condition:** App loaded at desktop size
**Result:** ✅ PASS

**Steps Executed:**
1. Resize viewport to 375×812 (iPhone standard)
2. Inspect page structure

**Expected Result:** Layout adapts; no overflow; controls remain accessible; mobile FAB appears
**Actual Result:** Header condensed (subtitle hidden), nav buttons repositioned, "+" FAB appeared at bottom of page replacing the header Add button, filter tabs and sort remained functional, cards remained readable.
**Evidence:** Snapshot at 375px showed `button "+"` FAB, condensed header, and all list content still accessible.

---

### TC-013: Notes "null" display bug

**Feature:** Entries without notes should show no notes text (not display "null")
**Pre-condition:** Entries exist with no notes entered
**Result:** ❌ FAIL

**Steps Executed:**
1. Observe list cards for Breaking Bad and Shogun (no notes added)
2. Inspect `.card-notes` elements via JavaScript

**Expected Result:** Cards with no notes show nothing (empty or hidden notes area)
**Actual Result:** Cards without notes display the literal text `"null"` visibly on the card. Two `.card-notes` divs confirmed containing the string `"null"`.
**Evidence:** `browser_evaluate` returned 2 elements: `{ tag: "DIV", class: "card-notes", text: "null" }`. The issue is the JS rendering `entry.notes` directly as `textContent` when the value is `null` from the API.

---

## Failures & Issues

| ID | Scenario | Severity | Description |
|----|----------|----------|-------------|
| TC-013 | Notes null display | Minor | Entries with no notes render the literal string `"null"` in the `.card-notes` element. Fix: guard with `entry.notes \|\| ''` before setting `textContent`, or conditionally hide the element when notes is null/empty. |

**Additional observation (not a test failure):**
- Missing `favicon.ico` causes a 404 on every page load (cosmetic only — add a favicon to eliminate the console noise).
- Edit modal pre-populates the Notes field with the string `"null"` when notes are absent — same root cause as TC-013.

---

## Sign-Off

**UAT Status:** CONDITIONAL PASS
**Report generated:** 2026-05-24
**Next steps:** One Minor bug to resolve before production release — fix the null notes rendering in `index.html` (guard `entry.notes` before assigning to `textContent`). All critical and major features — add, edit, delete, filter, sort, stats, responsive layout — are fully functional. Application is suitable for use once the notes display is patched.
