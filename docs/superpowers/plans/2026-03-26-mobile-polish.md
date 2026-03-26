# Mobile Polish & Visual Refinement — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the top nav with an iOS-style bottom tab bar, add mobile responsive spacing, and polish inputs/touch targets for a native-feeling mobile experience.

**Architecture:** Three independent CSS/component changes: (1) NavBar restructured as a fixed bottom tab bar with SVG icons, moved from per-page rendering to `app/calculators/layout.tsx`; (2) a `@media (max-width: 480px)` breakpoint in `globals.css` for spacing; (3) input/select touch target and focus improvements. A viewport export in `app/layout.tsx` enables iOS safe area support.

**Tech Stack:** Next.js 16, CSS (globals.css), React, inline SVG icons

**Spec:** `docs/superpowers/specs/2026-03-25-mobile-polish-design.md`

---

## Chunk 1: Bottom Tab Bar + NavBar Restructure

### Task 1: Add viewport export for iOS safe area

**Files:**
- Modify: `app/layout.tsx:1,15`

- [ ] **Step 1: Add Viewport import and export**

In `app/layout.tsx`, add `Viewport` to the type import on line 1, then add a viewport export after the metadata export.

Change line 1 from:

```ts
import type { Metadata } from 'next'
```

to:

```ts
import type { Metadata, Viewport } from 'next'
```

Add after the closing `}` of the metadata export (after line 31):

```ts
export const viewport: Viewport = {
  viewportFit: 'cover',
}
```

- [ ] **Step 2: Verify the build passes**

Run: `npm run build`

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add viewport-fit cover for iOS safe area support"
```

---

### Task 2: Rewrite NavBar as bottom tab bar with icons

**Files:**
- Modify: `components/NavBar.tsx`

This is the biggest single change. The entire NavBar component gets rewritten from a horizontal top link bar to a fixed bottom tab bar with SVG icons above labels.

- [ ] **Step 1: Rewrite `components/NavBar.tsx`**

Replace the entire file contents with:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  {
    label: 'Home',
    href: '/calculators',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Write-Off',
    href: '/calculators/write-off',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    label: 'Home Office',
    href: '/calculators/home-office',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'Quarterly',
    href: '/calculators/quarterly-estimates',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/calculators/profile',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="tab-bar">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`tab-item${pathname === tab.href ? ' active' : ''}`}
        >
          {tab.icon}
          <span className="tab-label">{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/NavBar.tsx
git commit -m "feat: rewrite NavBar as iOS-style bottom tab bar with icons"
```

---

### Task 3: Replace top nav CSS with bottom tab bar CSS

**Files:**
- Modify: `app/globals.css:22-25,27-65,68-91`

- [ ] **Step 1: Add padding-bottom to `.page` for tab bar clearance**

In `app/globals.css`, change the `.page` rule (lines 22-25) from:

```css
.page {
  width: 100%;
  max-width: 480px;
}
```

to:

```css
.page {
  width: 100%;
  max-width: 480px;
  padding-bottom: calc(72px + env(safe-area-inset-bottom));
}
```

- [ ] **Step 2: Replace the old nav styles with bottom tab bar styles**

Remove the entire old navigation block (lines 27-65):

```css
/* Navigation tabs */
.nav-bar {
  display: flex;
  gap: 2px;
  font-family: var(--font-mono), monospace;
  font-size: 10px;
  letter-spacing: 0.5px;
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: 9px 2px;
  background: #1a1a1a;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  white-space: nowrap;
}

.nav-item:first-child {
  border-radius: 4px 0 0 0;
}

.nav-item:last-child {
  border-radius: 0 4px 0 0;
}

.nav-item:hover {
  color: #ccc;
  background: #222;
}

.nav-item.active {
  background: #faf9f6;
  color: #1a1a1a;
  font-weight: 600;
}
```

Replace with:

```css
/* Bottom tab bar (iOS-style) */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(56px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  background: #faf9f6;
  border-top: 1px solid #ddd;
  z-index: 50;
  font-family: var(--font-mono), monospace;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #999;
  text-decoration: none;
  transition: color 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.tab-item.active {
  color: #1a1a1a;
}

.tab-label {
  font-size: 10px;
  letter-spacing: 0.3px;
}
```

- [ ] **Step 3: Update receipt border-radius**

Change the `.receipt` rule's `border-radius` (line 71) from:

```css
border-radius: 0 0 4px 4px;
```

to:

```css
border-radius: 4px;
```

- [ ] **Step 4: Verify the build passes**

Run: `npm run build`

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "style: replace top nav CSS with iOS-style bottom tab bar"
```

---

### Task 4: Move NavBar to calculators layout and remove from page components

**Files:**
- Modify: `app/calculators/layout.tsx`
- Modify: `components/Calculator.tsx`
- Modify: `components/HomeOfficeCalculator.tsx`
- Modify: `components/QuarterlyCalculator.tsx`
- Modify: `components/ProfilePage.tsx`
- Modify: `app/calculators/page.tsx`

- [ ] **Step 1: Update `app/calculators/layout.tsx` to render NavBar**

Change from:

```tsx
export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

to:

```tsx
import NavBar from '@/components/NavBar'

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NavBar />
    </>
  )
}
```

Note: NavBar renders *after* children since it's fixed to the bottom and should not affect document flow order.

- [ ] **Step 2: Remove NavBar from Calculator.tsx**

In `components/Calculator.tsx`:
- Remove the import line: `import NavBar from '@/components/NavBar'`
- Remove `<NavBar />` from the JSX (line 24)

- [ ] **Step 3: Remove NavBar from HomeOfficeCalculator.tsx**

In `components/HomeOfficeCalculator.tsx`:
- Remove the import line: `import NavBar from '@/components/NavBar'`
- Remove `<NavBar />` from the JSX (line 71)

- [ ] **Step 4: Remove NavBar from QuarterlyCalculator.tsx**

In `components/QuarterlyCalculator.tsx`:
- Remove the import line: `import NavBar from '@/components/NavBar'`
- Remove `<NavBar />` from the JSX (line 175)

- [ ] **Step 5: Remove NavBar from ProfilePage.tsx**

In `components/ProfilePage.tsx`:
- Remove the import line: `import NavBar from '@/components/NavBar'`
- Remove `<NavBar />` from the JSX (line 173)

- [ ] **Step 6: Remove NavBar from hub page**

In `app/calculators/page.tsx`:
- Remove the import line: `import NavBar from '@/components/NavBar'`
- Remove `<NavBar />` from the JSX (line 39)

- [ ] **Step 7: Verify the build passes**

Run: `npm run build`

Expected: Build succeeds. All 17 static pages generated.

- [ ] **Step 8: Commit**

```bash
git add app/calculators/layout.tsx components/Calculator.tsx components/HomeOfficeCalculator.tsx components/QuarterlyCalculator.tsx components/ProfilePage.tsx app/calculators/page.tsx
git commit -m "refactor: move NavBar to calculators layout, remove from page components"
```

---

## Chunk 2: Mobile Spacing + Input Polish + Final Verification

### Task 5: Add mobile responsive breakpoint

**Files:**
- Modify: `app/globals.css` (append at end of file)

- [ ] **Step 1: Add the mobile breakpoint**

Append to the end of `app/globals.css`:

```css
/* Mobile responsive adjustments */
@media (max-width: 480px) {
  body {
    padding: 16px 12px;
  }

  .receipt {
    padding: 24px 16px;
  }

  .receipt-header {
    padding-bottom: 14px;
    margin-bottom: 14px;
  }

  .profile-section {
    margin-bottom: 14px;
  }

  .receipt-footer {
    font-size: 9px;
    line-height: 1.6;
  }

  .compare-row {
    flex-wrap: wrap;
  }

  .compare-item {
    flex: 0 0 48%;
  }
}
```

- [ ] **Step 2: Verify the build passes**

Run: `npm run build`

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: add mobile responsive breakpoint for tighter spacing"
```

---

### Task 6: Polish input touch targets and focus states

**Files:**
- Modify: `app/globals.css:152-175`

- [ ] **Step 1: Update input/select touch targets**

Change the `.profile-row input, .profile-row select` rule (lines 152-165) from:

```css
.profile-row input,
.profile-row select {
  background: transparent;
  border: none;
  border-bottom: 1px dashed #aaa;
  font-family: var(--font-mono), monospace;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: right;
  padding: 2px 0;
  width: 140px;
  outline: none;
}
```

to:

```css
.profile-row input,
.profile-row select {
  background: transparent;
  border: none;
  border-bottom: 1px dashed #aaa;
  font-family: var(--font-mono), monospace;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: right;
  padding: 8px 0;
  min-height: 44px;
  width: 140px;
}
```

Changes: `padding` from `2px 0` to `8px 0`, added `min-height: 44px`, removed `outline: none` (will be handled by focus-visible).

- [ ] **Step 2: Update input/select focus states**

Change the `.profile-row input:focus, .profile-row select:focus` rule (lines 167-170) from:

```css
.profile-row input:focus,
.profile-row select:focus {
  border-bottom-color: #1a1a1a;
}
```

to:

```css
.profile-row input:focus-visible,
.profile-row select:focus-visible {
  border-bottom-color: #1a1a1a;
  outline: 2px solid #1a1a1a;
  outline-offset: 2px;
}
```

- [ ] **Step 3: Update purchase input focus state**

Change the `.purchase-input:focus` rule (lines 248-250) from:

```css
.purchase-input:focus {
  border-bottom-color: #1a1a1a;
}
```

to:

```css
.purchase-input:focus-visible {
  border-bottom-color: #1a1a1a;
  outline: 2px solid #1a1a1a;
  outline-offset: 2px;
}
```

Also remove `outline: none;` from the `.purchase-input` rule (line 244).

- [ ] **Step 4: Add global focus-visible rule for buttons**

Add after the existing `.compare-item .effective` rule (after line 452):

```css
.compare-item:focus-visible,
.breakdown-toggle:focus-visible {
  outline: 2px solid #1a1a1a;
  outline-offset: 2px;
}
```

- [ ] **Step 5: Verify the build passes**

Run: `npm run build`

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "style: polish input touch targets and add focus-visible states"
```

---

### Task 7: Final verification

- [ ] **Step 1: Run the build**

Run: `npm run build`

Expected: Build succeeds with no errors. All routes generate as static content.

- [ ] **Step 2: Run existing tests**

Run: `npm test`

Expected: All existing tests pass.

- [ ] **Step 3: Manual smoke test — desktop**

Run: `npm run dev`

Visit each page in a desktop browser:
1. Receipt is centered at 480px with all corners rounded
2. Bottom tab bar is visible at the bottom with 5 icon+label tabs
3. Active tab is highlighted in dark
4. Clicking tabs navigates correctly
5. No content hidden behind the tab bar

- [ ] **Step 4: Manual smoke test — mobile (375px)**

In browser dev tools, toggle mobile view (iPhone SE or 375px width):
1. Body padding is tighter (16px 12px)
2. Receipt padding is tighter (24px 16px)
3. Bottom tab bar fits comfortably with all 5 tabs
4. Quick Compare items wrap to 2×2 grid
5. Input fields have comfortable 44px touch targets
6. Tab bar sits above the simulated home indicator area
