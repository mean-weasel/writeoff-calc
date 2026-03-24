'use client'

import { useState } from 'react'
import type { TaxProfile } from '@/lib/tax-engine'
import { ALL_STATES, STATE_WARNINGS } from '@/lib/state-tax-data'
import { parseCurrencyInput } from '@/lib/format'

interface SharedProfileProps {
  profile: TaxProfile
  onChange: (profile: TaxProfile) => void
}

const STATE_ABBR: Record<string, string> = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
  'District of Columbia': 'DC',
}

const FILING_LABELS: Record<string, string> = {
  single: 'Single',
  mfj: 'MFJ',
  mfs: 'MFS',
  hoh: 'HoH',
}

function formatCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`
  }
  if (amount >= 1_000) {
    const k = amount / 1_000
    return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`
  }
  return `$${amount}`
}

function formatForDisplay(amount: number): string {
  const abs = Math.abs(amount)
  const whole = Math.round(abs)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const formatted = `$${whole}`
  return amount < 0 ? `-${formatted}` : formatted
}

function ProfileSummary({ profile }: { profile: TaxProfile }) {
  const abbr = STATE_ABBR[profile.state] ?? profile.state
  const filing = FILING_LABELS[profile.filingStatus] ?? profile.filingStatus
  const parts: string[] = []
  if (profile.w2Income > 0) parts.push(`${formatCompact(profile.w2Income)} W-2`)
  if (profile.llcNetIncome > 0) parts.push(`${formatCompact(profile.llcNetIncome)} LLC`)
  parts.push(filing)
  parts.push(abbr)
  parts.push(String(profile.taxYear))
  return <span>{parts.join(' \u00b7 ')}</span>
}

function ProfileForm({ profile, onChange }: SharedProfileProps) {
  const [w2Display, setW2Display] = useState(() => formatForDisplay(profile.w2Income))
  const [llcDisplay, setLlcDisplay] = useState(() => formatForDisplay(profile.llcNetIncome))

  const stateWarning = STATE_WARNINGS[profile.state]

  function handleW2Focus() {
    setW2Display(profile.w2Income === 0 ? '' : String(profile.w2Income))
  }

  function handleW2Blur(e: React.FocusEvent<HTMLInputElement>) {
    const value = parseCurrencyInput(e.target.value)
    const newProfile = { ...profile, w2Income: isNaN(value) ? 0 : value }
    onChange(newProfile)
    setW2Display(formatForDisplay(newProfile.w2Income))
  }

  function handleW2Change(e: React.ChangeEvent<HTMLInputElement>) {
    setW2Display(e.target.value)
  }

  function handleLlcFocus() {
    setLlcDisplay(profile.llcNetIncome === 0 ? '' : String(profile.llcNetIncome))
  }

  function handleLlcBlur(e: React.FocusEvent<HTMLInputElement>) {
    const value = parseCurrencyInput(e.target.value)
    const newProfile = { ...profile, llcNetIncome: isNaN(value) ? 0 : value }
    onChange(newProfile)
    setLlcDisplay(formatForDisplay(newProfile.llcNetIncome))
  }

  function handleLlcChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLlcDisplay(e.target.value)
  }

  return (
    <>
      <div className="profile-row">
        <span className="label">W-2 Income</span>
        <input
          type="text"
          inputMode="numeric"
          value={w2Display}
          onFocus={handleW2Focus}
          onBlur={handleW2Blur}
          onChange={handleW2Change}
        />
      </div>
      <div
        style={{
          fontSize: '10px',
          color: '#999',
          lineHeight: '1.4',
          marginBottom: '8px',
          textAlign: 'right',
        }}
      >
        Sets your tax bracket and affects SE tax on LLC income — both change your write-off savings
      </div>

      <div className="profile-row">
        <span className="label">LLC Net Income</span>
        <input
          type="text"
          inputMode="numeric"
          value={llcDisplay}
          onFocus={handleLlcFocus}
          onBlur={handleLlcBlur}
          onChange={handleLlcChange}
        />
      </div>

      <div className="profile-row">
        <span className="label">Filing Status</span>
        <select
          value={profile.filingStatus}
          onChange={(e) =>
            onChange({
              ...profile,
              filingStatus: e.target.value as TaxProfile['filingStatus'],
            })
          }
        >
          <option value="single">Single</option>
          <option value="mfj">Married Filing Jointly</option>
          <option value="mfs">Married Filing Separately</option>
          <option value="hoh">Head of Household</option>
        </select>
      </div>

      <div className="profile-row" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <span className="label" style={{ paddingTop: '2px' }}>
          State
        </span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <select value={profile.state} onChange={(e) => onChange({ ...profile, state: e.target.value })}>
            {ALL_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {stateWarning && (
            <span
              style={{
                fontSize: '10px',
                color: '#999',
                marginTop: '4px',
                maxWidth: '200px',
                textAlign: 'right',
                lineHeight: '1.4',
              }}
            >
              {stateWarning}
            </span>
          )}
        </div>
      </div>

      <div className="profile-row">
        <span className="label">Tax Year</span>
        <select
          value={profile.taxYear}
          onChange={(e) =>
            onChange({
              ...profile,
              taxYear: Number(e.target.value) as TaxProfile['taxYear'],
            })
          }
        >
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
      </div>
    </>
  )
}

export default function SharedProfile({ profile, onChange }: SharedProfileProps) {
  const hasFilled = profile.w2Income > 0 || profile.llcNetIncome > 0
  const [expanded, setExpanded] = useState(!hasFilled)

  if (hasFilled && !expanded) {
    return (
      <div className="profile-section" onClick={() => setExpanded(true)} style={{ cursor: 'pointer' }}>
        <div className="section-label">Your Tax Profile</div>
        <div
          style={{
            textAlign: 'center',
            fontSize: '13px',
            padding: '4px 0',
            color: '#666',
          }}
        >
          <ProfileSummary profile={profile} />
        </div>
        <div
          style={{
            textAlign: 'center',
            fontSize: '10px',
            color: '#999',
          }}
        >
          tap to edit
        </div>
      </div>
    )
  }

  return (
    <div className="profile-section">
      <div
        className="section-label"
        onClick={() => hasFilled && setExpanded(false)}
        style={hasFilled ? { cursor: 'pointer' } : undefined}
      >
        Your Tax Profile
      </div>
      <ProfileForm profile={profile} onChange={onChange} />
    </div>
  )
}
