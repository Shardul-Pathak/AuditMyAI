'use client'

import { useState } from 'react'
import Link from 'next/link'
import ReportHeader from '@/components/report/ReportHeader'
import PdfViewer from '@/components/report/PdfViewer'
import LeadCaptureForm from '@/components/report/LeadCaptureForm'
import ShareModal from '@/components/report/ShareModal'

const SAVINGS = 642

export default function AuditReportPage() {
  const [shareOpen, setShareOpen] = useState(false)
  const [leadOpen, setLeadOpen] = useState(false)

  function closeLeadModal() {
    setLeadOpen(false)
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Audit My AI" className="h-8 w-8 rounded-md object-contain" />
            <p className="text-sm font-semibold text-slate-800">Audit My AI Report</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-300"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
            Back to landing page
          </Link>
        </div>
      </nav>

      <ReportHeader
        savings={SAVINGS}
        annualSavings={SAVINGS * 12}
        onShare={() => setShareOpen(true)}
        onGetMail={() => setLeadOpen(true)}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex justify-center">

          {/* Main column */}
          <div className="space-y-6 sm:space-y-8 min-w-0 w-full xl:max-w-5xl">
            <div className="sm:hidden flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
              <svg className="h-4 w-4 animate-bounce text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              Keep scrolling for actions
            </div>
            <PdfViewer pdfUrl="/audit_report.pdf" />

            <div className="sm:hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Report actions</p>
              <div className="mt-3 grid gap-3">
                <button
                  type="button"
                  onClick={() => setLeadOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(16,185,129,0.25)] transition-colors hover:bg-brand-dark"
                >
                  <span>Get Report via Mail</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShareOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <span>Share Report</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}

      {leadOpen && (
        <div
          className="fixed inset-0 z-[99998] flex items-center justify-center p-4"
          onClick={closeLeadModal}
        >
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" />
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-1">Get mail</p>
                <h3 className="text-lg font-bold text-slate-950">Get the report by email</h3>
              </div>
              <button
                type="button"
                onClick={closeLeadModal}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close lead form"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-[85vh] overflow-y-auto p-4 sm:p-6">
              <LeadCaptureForm />
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Audit My AI" className="h-7 w-7 rounded-md object-contain" />
            <p className="text-sm text-slate-500">Need to start a new audit?</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Go to landing page
          </Link>
        </div>
      </footer>

    </main>
  )
}
