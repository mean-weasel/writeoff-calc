import { describe, it, expect } from 'vitest'
import {
  getQuarterlyDueDates,
  computeSafeHarbor,
  computeQuarterlyEstimates,
  QuarterlyInputs,
} from '../quarterly-engine'
import type { TaxProfile } from '../tax-engine'

const baseProfile: TaxProfile = {
  w2Income: 150_000,
  llcNetIncome: 80_000,
  filingStatus: 'single',
  taxYear: 2025,
  state: 'Arizona',
}

describe('getQuarterlyDueDates', () => {
  it('returns 4 due dates for 2025', () => {
    const dates = getQuarterlyDueDates(2025)
    expect(dates).toHaveLength(4)
  })

  it('2025 Q1 is April 15', () => {
    const dates = getQuarterlyDueDates(2025)
    expect(dates[0]).toEqual({ quarter: 'Q1', label: 'Apr 15, 2025', date: '2025-04-15' })
  })

  it('2025 Q2 is June 16 (June 15 is Sunday)', () => {
    const dates = getQuarterlyDueDates(2025)
    expect(dates[1]).toEqual({ quarter: 'Q2', label: 'Jun 16, 2025', date: '2025-06-16' })
  })

  it('2025 Q3 is September 16 (September 15 is Sunday)', () => {
    const dates = getQuarterlyDueDates(2025)
    expect(dates[2]).toEqual({ quarter: 'Q3', label: 'Sep 16, 2025', date: '2025-09-16' })
  })

  it('2025 Q4 is January 15, 2026', () => {
    const dates = getQuarterlyDueDates(2025)
    expect(dates[3]).toEqual({ quarter: 'Q4', label: 'Jan 15, 2026', date: '2026-01-15' })
  })

  it('returns 4 due dates for 2026', () => {
    const dates = getQuarterlyDueDates(2026)
    expect(dates).toHaveLength(4)
    expect(dates[0].quarter).toBe('Q1')
    expect(dates[3].quarter).toBe('Q4')
  })

  it('2026 Q2 is June 16 (June 15 is Sunday)', () => {
    const dates = getQuarterlyDueDates(2026)
    expect(dates[1]).toEqual({ quarter: 'Q2', label: 'Jun 16, 2026', date: '2026-06-16' })
  })
})

describe('computeSafeHarbor', () => {
  it('returns 100% of prior year when AGI <= $150K and prior < 90% current', () => {
    // prior=30K, current=50K, AGI=120K => prior=30K, 90% current=45K => lesser=30K
    const result = computeSafeHarbor(30_000, 50_000, 120_000)
    expect(result.safeHarborAmount).toBe(30_000)
    expect(result.method).toBe('100% prior year')
  })

  it('returns 110% of prior year when AGI > $150K and prior < 90% current', () => {
    // prior=40K, current=60K, AGI=200K => 110% prior=44K, 90% current=54K => lesser=44K
    const result = computeSafeHarbor(40_000, 60_000, 200_000)
    expect(result.safeHarborAmount).toBe(44_000)
    expect(result.method).toBe('110% prior year (AGI > $150K)')
  })

  it('returns 90% current year when lower than prior year', () => {
    // prior=50K, current=40K, AGI=120K => 100% prior=50K, 90% current=36K => lesser=36K
    const result = computeSafeHarbor(50_000, 40_000, 120_000)
    expect(result.safeHarborAmount).toBe(36_000)
    expect(result.method).toBe('90% current year')
  })

  it('uses $150K threshold exactly', () => {
    const atThreshold = computeSafeHarbor(30_000, 50_000, 150_000)
    expect(atThreshold.safeHarborAmount).toBe(30_000) // 100%, not 110%

    const aboveThreshold = computeSafeHarbor(30_000, 50_000, 150_001)
    expect(aboveThreshold.safeHarborAmount).toBe(33_000) // 110%
  })

  it('returns 0 for zero prior year tax when current is also 0', () => {
    const result = computeSafeHarbor(0, 0, 100_000)
    expect(result.safeHarborAmount).toBe(0)
  })
})

describe('computeQuarterlyEstimates', () => {
  const baseInputs: QuarterlyInputs = {
    annualWithholding: 28_500,
    priorYearTax: 45_000,
  }

  it('returns total tax liability from the tax engine', () => {
    const result = computeQuarterlyEstimates(baseProfile, baseInputs)
    expect(result.totalTaxLiability).toBeGreaterThan(40_000)
  })

  it('subtracts withholding from total liability', () => {
    const result = computeQuarterlyEstimates(baseProfile, baseInputs)
    expect(result.remainingLiability).toBe(result.totalTaxLiability - baseInputs.annualWithholding)
  })

  it('divides remaining by 4 for quarterly payment', () => {
    const result = computeQuarterlyEstimates(baseProfile, baseInputs)
    expect(result.quarterlyPayment).toBeCloseTo(result.remainingLiability / 4, 0)
  })

  it('returns due dates matching the tax year', () => {
    const result = computeQuarterlyEstimates(baseProfile, baseInputs)
    expect(result.dueDates).toHaveLength(4)
    expect(result.dueDates[0].quarter).toBe('Q1')
  })

  it('detects when no estimated payments needed (de minimis)', () => {
    const highWithholding: QuarterlyInputs = {
      annualWithholding: 60_000, // more than enough
      priorYearTax: 45_000,
    }
    const result = computeQuarterlyEstimates(baseProfile, highWithholding)
    expect(result.noPaymentNeeded).toBe(true)
    expect(result.noPaymentReason).toContain('less than $1,000')
  })

  it('computes safe harbor amount', () => {
    const result = computeQuarterlyEstimates(baseProfile, baseInputs)
    expect(result.safeHarbor.safeHarborAmount).toBeGreaterThan(0)
  })

  it('computes W-4 increase suggestion', () => {
    const result = computeQuarterlyEstimates(baseProfile, baseInputs)
    expect(result.w4Increase).toBeDefined()
    expect(result.w4Increase.annualIncrease).toBe(result.remainingLiability)
    expect(result.w4Increase.perPaycheck26).toBeCloseTo(result.remainingLiability / 26, 0)
    expect(result.w4Increase.perPaycheck24).toBeCloseTo(result.remainingLiability / 24, 0)
  })

  it('handles zero LLC income', () => {
    const zeroLLC: TaxProfile = { ...baseProfile, llcNetIncome: 0 }
    const result = computeQuarterlyEstimates(zeroLLC, baseInputs)
    expect(result.totalTaxLiability).toBeGreaterThan(0) // W-2 still has tax
  })

  it('remaining liability floors at 0 (no negative)', () => {
    const highWithholding: QuarterlyInputs = {
      annualWithholding: 200_000,
      priorYearTax: 45_000,
    }
    const result = computeQuarterlyEstimates(baseProfile, highWithholding)
    expect(result.remainingLiability).toBe(0)
    expect(result.quarterlyPayment).toBe(0)
  })
})
