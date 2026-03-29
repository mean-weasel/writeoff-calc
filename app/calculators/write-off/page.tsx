import type { Metadata } from 'next'
import CalculatorLoader from '@/components/CalculatorLoader'
import { SITE_URL } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Tax Write-Off Calculator 2025–2026 — See Your Real Cost After Deductions',
  description:
    'Free tax write-off calculator for W-2 employees with an LLC or side business. Enter a business expense and see what it actually costs after your tax deduction.',
  alternates: { canonical: '/calculators/write-off' },
  openGraph: {
    title: 'See What Business Expenses Actually Cost You',
    description:
      'Enter any purchase and see the real price after your tax write-off. Built for W-2 employees with a side business.',
  },
}

export default function WriteOffPage() {
  return (
    <main>
      <CalculatorLoader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Business Write-Off Calculator',
            description: 'Enter a business purchase and see what it actually costs after tax write-offs.',
            url: `${SITE_URL}/calculators/write-off`,
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
