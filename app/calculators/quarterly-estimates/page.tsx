import type { Metadata } from 'next'
import QuarterlyLoader from '@/components/QuarterlyLoader'

export const metadata: Metadata = {
  title: 'Quarterly Estimated Tax Calculator 2025–2026 — W-2 + Self-Employment',
  description:
    'Calculate how much to set aside each quarter when you have W-2 income and an LLC. Includes safe harbor rules and W-4 withholding strategy.',
}

export default function QuarterlyEstimatesPage() {
  return (
    <main className="page">
      <QuarterlyLoader />
    </main>
  )
}
