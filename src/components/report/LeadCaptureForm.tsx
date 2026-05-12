'use client'

import { useState } from 'react'
import { FieldLabel, Input, Select } from '@/components/AuditFormFields'
import LeadSuccessState from './LeadSuccessState'

const COMPANY_SIZE_OPTIONS = ['1', '1-10', '11-50', '50+'] as const

function LeadCaptureForm({ auditId, onClose }: { auditId: string; onClose: () => void }) {
  const [data, setData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    companySize: '',
  })
  const [done, setDone] = useState<{
    emailSent: boolean
    emailError?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (partial: Partial<typeof data>) =>
    setData((prev) => ({ ...prev, ...partial }))

  const handleSubmit = async () => {
    setError(null)

    if (!data.companyName.trim()) {
      setError('Company name is required')
      return
    }
    if (!data.firstName.trim()) {
      setError('First name is required')
      return
    }
    if (!data.lastName.trim()) {
      setError('Last name is required')
      return
    }
    if (!data.email.trim()) {
      setError('Work email is required')
      return
    }
    if (!data.email.includes('@')) {
      setError('Please enter a valid work email')
      return
    }
    if (!data.companySize) {
      setError('Company size is required')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId,
          companyName: data.companyName.trim(),
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.trim(),
          companySize: data.companySize,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to submit')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to send report')
      }

      const emailSent = Boolean(result.data?.emailSent)
      const emailError =
        typeof result.data?.emailError === 'string' ? result.data.emailError : undefined
      setDone({ emailSent, emailError })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (done) return <LeadSuccessState publicId={auditId} emailSent={done.emailSent} emailError={done.emailError} />

  return (
    <div className="w-full rounded-[32px] border border-white/60 bg-white/90 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-2">Get Your Report</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">Receive your audit report</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-6">

        <div>
          <FieldLabel>Company name</FieldLabel>
          <Input
            value={data.companyName}
            onChange={(v) => update({ companyName: v })}
            placeholder="Acme Inc."
            disabled={loading}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <FieldLabel>First name</FieldLabel>
            <Input
              value={data.firstName}
              onChange={(v) => update({ firstName: v })}
              placeholder="Jane"
              disabled={loading}
            />
          </div>
          <div>
            <FieldLabel>Last name</FieldLabel>
            <Input
              value={data.lastName}
              onChange={(v) => update({ lastName: v })}
              placeholder="Smith"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <FieldLabel>Work email</FieldLabel>
          <Input
            value={data.email}
            onChange={(v) => update({ email: v })}
            placeholder="jane@company.com"
            type="email"
            disabled={loading}
          />
        </div>

        <div>
          <FieldLabel>Company size</FieldLabel>
          <Select
            value={data.companySize}
            onChange={(v) => update({ companySize: v })}
            options={[...COMPANY_SIZE_OPTIONS]}
            disabled={loading}
            placeholder="Select company size"
          />
        </div>

      </div>

      <div className="mt-10 flex justify-between gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="group rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(16,185,129,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(16,185,129,0.32)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            {loading ? 'Sending...' : 'Send Report'}
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </span>
        </button>
      </div>

    </div>
  )
}

export default LeadCaptureForm
