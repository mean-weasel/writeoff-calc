# SEO Infrastructure & Social Sharing

## Problem

The site has good page titles and descriptions, but zero discoverability infrastructure. No OpenGraph tags (social sharing shows no preview), no sitemap (search engines can't efficiently discover pages), no structured data (no rich results), and no canonical URLs. The site is invisible to Google and looks blank when shared on Slack, Reddit, or iMessage.

## Goals

1. **Social sharing works:** Links shared anywhere show a receipt-themed card with the "clever & surprising" hook — *"That $2,000 laptop? It actually costs $1,320."*
2. **Search engines can index:** Sitemap and robots.txt tell crawlers what's available.
3. **Rich results possible:** JSON-LD structured data marks each calculator as a `WebApplication`.
4. **Custom domain ready:** `metadataBase` is the one line to change when a domain is connected.

## Design

### 1. metadataBase + Canonical URLs

Add `metadataBase` to the root layout metadata export:

```ts
metadataBase: new URL('https://writeoff-calc.vercel.app')
```

Add `alternates.canonical` to each page's metadata. Next.js resolves these relative to `metadataBase`, so each page just specifies its path:

- Hub: `/calculators`
- Write-Off: `/calculators/write-off`
- Home Office: `/calculators/home-office`
- Quarterly: `/calculators/quarterly-estimates`
- Profile: `/calculators/profile`

When a custom domain is connected, only the `metadataBase` URL in the root layout needs to change. Everything else derives from it.

### 2. OpenGraph + Twitter Card Tags

Add OG and Twitter metadata to every page's metadata export. Next.js merges these with the existing title/description.

**Root layout** — sets defaults inherited by all pages:

```ts
openGraph: {
  type: 'website',
  locale: 'en_US',
  siteName: 'Tax Calculators for W-2 + LLC Owners',
},
twitter: {
  card: 'summary_large_image',
},
```

**Hub page** — the "clever & surprising" hook:

```ts
openGraph: {
  title: 'That $2,000 laptop? It actually costs $1,320.',
  description: 'See the real price of business expenses after write-offs. Free tax calculators for W-2 employees with an LLC.',
},
```

**Write-Off page:**

```ts
openGraph: {
  title: 'See What Business Expenses Actually Cost You',
  description: 'Enter any purchase and see the real price after your tax write-off. Built for W-2 employees with a side business.',
},
```

**Home Office page:**

```ts
openGraph: {
  title: 'Your $2,400/mo Rent Actually Costs $1,632/mo',
  description: 'See the real monthly cost of rent, internet, and utilities after your home office deduction.',
},
```

**Quarterly Estimates page:**

```ts
openGraph: {
  title: 'How Much Should You Set Aside Each Quarter?',
  description: 'Calculate quarterly estimated taxes when you have a W-2 job and an LLC. Includes safe harbor rules.',
},
```

**Profile page:**

```ts
openGraph: {
  title: 'Your Tax Profile — Shared Across All Calculators',
  description: 'Set your W-2 income, LLC income, filing status, and state. Saved locally — nothing sent to any server.',
},
```

### 3. Dynamic OG Images

Use Next.js `opengraph-image.tsx` file convention with the `ImageResponse` API to generate receipt-themed social cards. Each page gets its own OG image file in its route directory.

**Image spec:**
- Size: 1200x630px (standard OG image)
- Content type: `image/png`
- Font: JetBrains Mono (the project's existing monospace font). Satori cannot use system fonts — the font must be loaded as a `.ttf` buffer and passed to `ImageResponse` via the `fonts` option. Download the font file at build time from Google Fonts or bundle a `.ttf` in the project.
- Theme: Dark background (#111), cream receipt card (#faf9f6), monospace text, dashed borders — matching the site's receipt aesthetic
- Each OG image file exports an `alt` string for accessibility (e.g., `export const alt = 'Tax calculator showing a $2,000 laptop costs $1,320 after write-offs'`)

**Hub page OG image** (`app/calculators/opengraph-image.tsx`):
- Top: "TAX CALCULATORS" in small uppercase
- Middle: "That $2,000 laptop?" large headline, "It actually costs $1,320." below in green
- Bottom: "For W-2 + LLC Owners • writeoff-calc.vercel.app"
- Torn-edge motif at bottom of receipt card (CSS zigzag pattern)

**Calculator page OG images** (`app/calculators/write-off/opengraph-image.tsx`, etc.):
- Same receipt template
- Page-specific headline and hook copy matching the OG titles above
- Each file follows the same template structure but with different text

Also create a root `app/opengraph-image.tsx` for the `/` redirect route (will show the hub image since `/` redirects to `/calculators`).

A `twitter-image.tsx` file is not needed — Next.js uses the OG image for Twitter cards when `twitter:card` is set and no separate Twitter image is provided.

### 4. Sitemap

Create `app/sitemap.ts` using the Next.js `MetadataRoute.Sitemap` type:

```ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://writeoff-calc.vercel.app/calculators', changeFrequency: 'weekly', priority: 1 },
    { url: 'https://writeoff-calc.vercel.app/calculators/write-off', changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://writeoff-calc.vercel.app/calculators/home-office', changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://writeoff-calc.vercel.app/calculators/quarterly-estimates', changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://writeoff-calc.vercel.app/calculators/profile', changeFrequency: 'monthly', priority: 0.5 },
  ]
}
```

**Note on hardcoded URLs:** The sitemap and robots.txt both hardcode the base URL. When a custom domain is connected, these files need updating alongside `metadataBase`. Consider extracting the base URL to a shared constant (e.g., `lib/site-config.ts`) so all three locations reference the same value.

Auto-served at `/sitemap.xml` by Next.js.

### 5. Robots.txt

Create `app/robots.ts` using the Next.js `MetadataRoute.Robots` type:

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://writeoff-calc.vercel.app/sitemap.xml',
  }
}
```

Allow all crawlers on all pages. No pages need blocking.

### 6. JSON-LD Structured Data

Add a `<script type="application/ld+json">` element to each page component. Use the `WebApplication` schema type.

**Hub page JSON-LD:**

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Tax Calculators for W-2 + LLC Owners",
  "description": "Free tax calculators for W-2 employees with a side business. See the real cost of write-offs, home office deductions, and quarterly estimated taxes.",
  "url": "https://writeoff-calc.vercel.app/calculators",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "browserRequirements": "Requires JavaScript"
}
```

**Calculator pages:** Same schema shape, with page-specific name, description, and URL.

The JSON-LD is rendered as a `<script>` tag inside the page's JSX. In Next.js server components, this is straightforward. For the client component calculator pages, the JSON-LD should be placed in the server component page wrapper (`page.tsx`) rather than inside the client component.

## Files changed

| File | Change |
|------|--------|
| `app/layout.tsx` | Add `metadataBase`, default `openGraph` and `twitter` fields |
| `app/calculators/page.tsx` | Add OG metadata overrides, canonical, JSON-LD script |
| `app/calculators/write-off/page.tsx` | Add OG metadata overrides, canonical, JSON-LD script |
| `app/calculators/home-office/page.tsx` | Add OG metadata overrides, canonical, JSON-LD script |
| `app/calculators/quarterly-estimates/page.tsx` | Add OG metadata overrides, canonical, JSON-LD script |
| `app/calculators/profile/page.tsx` | Add OG metadata overrides, canonical, JSON-LD script |

| File | Create |
|------|--------|
| `app/calculators/opengraph-image.tsx` | Dynamic OG image for hub page |
| `app/calculators/write-off/opengraph-image.tsx` | Dynamic OG image for write-off calculator |
| `app/calculators/home-office/opengraph-image.tsx` | Dynamic OG image for home office calculator |
| `app/calculators/quarterly-estimates/opengraph-image.tsx` | Dynamic OG image for quarterly estimates |
| `app/calculators/profile/opengraph-image.tsx` | Dynamic OG image for profile page |
| `app/opengraph-image.tsx` | Root OG image (for `/` redirect route — shows hub image) |
| `app/sitemap.ts` | Sitemap listing all public pages |
| `app/robots.ts` | Robots.txt allowing all crawlers |

## Out of scope

- Custom domain purchase and DNS setup (user action; code is ready for a one-line `metadataBase` update)
- Google Search Console submission (requires custom domain first)
- Analytics integration (separate concern)
- Content pages / guides (Sub-Project 2)
- Visual polish and modernization (Sub-Project 3)
- Custom 404 page (Sub-Project 3)
