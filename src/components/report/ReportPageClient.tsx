'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { PublicAuditReportDto } from '@/utils/dto/types'
import ReportHeader from './ReportHeader'
import ShareModal from './ShareModal'
import LeadCaptureForm from './LeadCaptureForm'

function formatToolName(name: string) {
  return name.replace(/_/g, ' ')
}

/** Calendar date from ISO — same output on server and client (avoids `toLocaleDateString` hydration mismatches). */
function formatReportDate(iso: string): string {
  const fromIso = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (fromIso) {
    const [, y, mo, d] = fromIso
    return `${d}/${mo}/${y}`
  }
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return iso
  const u = new Date(t)
  const y = u.getUTCFullYear()
  const mo = String(u.getUTCMonth() + 1).padStart(2, '0')
  const d = String(u.getUTCDate()).padStart(2, '0')
  return `${d}/${mo}/${y}`
}

type Props = { report: PublicAuditReportDto }

export default function ReportPageClient({ report }: Props) {
  const [shareOpen, setShareOpen] = useState(false)
  const [mailOpen, setMailOpen] = useState(false)

  const wasteReduction = useMemo(() => {
    if (!report.totalMonthlySpend) return 0
    return (report.totalMonthlySavings / report.totalMonthlySpend) * 100
  }, [report.totalMonthlySpend, report.totalMonthlySavings])

  return (
    <>
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold text-brand hover:text-brand-dark">
            ← AuditMyAI
          </Link>
          <p className="text-xs text-slate-400 truncate">
            Report · {formatReportDate(report.createdAt)}
          </p>
        </div>
      </header>

      <ReportHeader
        savings={Math.round(report.totalMonthlySavings)}
        annualSavings={Math.round(report.totalAnnualSavings)}
        wasteReduction={wasteReduction}
        onShare={() => setShareOpen(true)}
        onGetMail={() => setMailOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 pb-24">
        <div className="grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-3">Executive summary</p>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{report.summary}</p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-500">
              <span>
                <span className="font-semibold text-slate-800">Team size:</span> {report.teamSize}
              </span>
              <span>
                <span className="font-semibold text-slate-800">Primary use case:</span>{' '}
                {formatToolName(report.primaryUseCase)}
              </span>
              <span>
                <span className="font-semibold text-slate-800">Optimization score:</span> {report.auditScore}/100
              </span>
            </div>
          </section>

          <aside className="rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 sm:p-7 shadow-sm h-fit">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 mb-2">Spend snapshot</p>
            <p className="text-2xl font-bold text-slate-950">${report.totalMonthlySpend.toLocaleString()}/mo</p>
            <p className="mt-2 text-sm text-slate-600">Current estimated monthly AI spend across audited tools.</p>
            <p className="mt-6 text-sm font-semibold text-emerald-700">
              Potential savings: ${Math.round(report.totalMonthlySavings).toLocaleString()}/mo
            </p>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950 mb-6">Per-tool recommendations</h2>
          <div className="space-y-4">
            {report.items.map((item, index) => (
              <article
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{formatToolName(item.toolName)}</h3>
                    <p className="text-sm text-slate-500">
                      {formatToolName(item.currentPlan)} → {formatToolName(item.recommendedPlan)} ·{' '}
                      <span className="font-medium text-brand">{formatToolName(item.recommendationType)}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Monthly savings</p>
                    <p className="text-xl font-bold text-emerald-600">${Math.round(item.monthlySavings).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.reasoning}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>Current: ${item.currentMonthlyCost.toLocaleString()}/mo</span>
                  <span>Target: ${item.recommendedMonthlyCost.toLocaleString()}/mo</span>
                  <span>Confidence: {Math.round(item.confidenceScore * 100)}%</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-12 sm:hidden flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setMailOpen(true)}
            className="rounded-2xl bg-brand px-5 py-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(16,185,129,0.25)]"
          >
            Get Report via Mail
          </button>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700"
          >
            Share Report
          </button>
        </div>
      </div>

      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
      {mailOpen && (
        <div className="fixed inset-0 z-[99998] flex items-center justify-center p-4 overflow-y-auto">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close"
            onClick={() => setMailOpen(false)}
          />
          <div className="relative z-[99999] w-full max-w-lg my-8">
            <LeadCaptureForm auditId={report.publicId} onClose={() => setMailOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
