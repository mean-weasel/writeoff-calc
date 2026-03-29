import type { Metadata } from 'next'
import HomeOfficeLoader from '@/components/HomeOfficeLoader'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Home Office Deduction Calculator 2025–2026 — See Your Real Monthly Costs',
  description:
    'Free home office deduction calculator for W-2 employees with an LLC. Compare simplified vs. actual method and see the real cost of rent, internet, and utilities after your tax deduction.',
  alternates: { canonical: '/calculators/home-office' },
  openGraph: {
    title: 'Your $2,400/mo Rent Actually Costs $1,632/mo',
    description: 'See the real monthly cost of rent, internet, and utilities after your home office deduction.',
  },
}

export default function HomeOfficePage() {
  return (
    <main>
      <HomeOfficeLoader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Home Office Deduction Calculator',
            description:
              'See the real cost of your rent, internet, phone, and utilities after your home office tax deduction.',
            url: `${SITE_URL}/calculators/home-office`,
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'All',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            browserRequirements: 'Requires JavaScript',
          }),
        }}
      />
    </main>
  )
}
