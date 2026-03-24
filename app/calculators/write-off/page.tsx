import type { Metadata } from 'next'
import CalculatorLoader from '@/components/CalculatorLoader'

export const metadata: Metadata = {
  title: 'Business Write-Off Calculator 2025–2026 — See Your Real Cost',
  description:
    'Enter a business purchase and see what it actually costs after tax write-offs. Free calculator for W-2 employees with an LLC or side business.',
}

export default function WriteOffPage() {
  return (
    <main className="page">
      <CalculatorLoader />
    </main>
  )
}
