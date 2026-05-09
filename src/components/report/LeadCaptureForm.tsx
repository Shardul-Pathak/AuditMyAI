'use client'

import { useState } from 'react'
import type { LeadData } from '@/utils/leadForm/types'
import { INITIAL_LEAD_DATA, COMPANY_SIZES, INDUSTRIES, ROLES } from '@/utils/leadForm/constants'
import { FieldLabel, Input, Select } from '@/components/AuditFormFields'
import LeadSuccessState from './LeadSuccessState'

export default function LeadCaptureForm() {
  const [data, setData] = useState<LeadData>(INITIAL_LEAD_DATA)
  const [submitted, setSubmitted] = useState(false)

  const update = (partial: Partial<LeadData>) =>
    setData((prev) => ({ ...prev, ...partial }))

  if (submitted) return <LeadSuccessState />

  return (
    <div className="w-full rounded-[32px] border border-white/60 bg-white/90 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-2">Company Details</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">Tell us about your company</h2>
      </div>

      <div className="space-y-6">

        <div>
          <FieldLabel>Company name</FieldLabel>
          <Input value={data.companyName} onChange={(v) => update({ companyName: v })} placeholder="Acme Inc." />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Company size</FieldLabel>
            <Select value={data.companySize} onChange={(v) => update({ companySize: v })} options={COMPANY_SIZES} />
          </div>
          <div>
            <FieldLabel>Industry</FieldLabel>
            <Select value={data.industry} onChange={(v) => update({ industry: v })} options={INDUSTRIES} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel>First name</FieldLabel>
            <Input value={data.firstName} onChange={(v) => update({ firstName: v })} placeholder="Jane" />
          </div>
          <div>
            <FieldLabel>Last name</FieldLabel>
            <Input value={data.lastName} onChange={(v) => update({ lastName: v })} placeholder="Smith" />
          </div>
        </div>

        <div>
          <FieldLabel>Work email</FieldLabel>
          <Input value={data.email} onChange={(v) => update({ email: v })} placeholder="jane@company.com" type="email" />
        </div>

        <div>
          <FieldLabel>Your role</FieldLabel>
          <Select value={data.role} onChange={(v) => update({ role: v })} options={ROLES} />
        </div>

      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="group rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(16,185,129,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(16,185,129,0.32)]"
        >
          <span className="flex items-center gap-2">
            Continue
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </span>
        </button>
      </div>

    </div>
  )
}
