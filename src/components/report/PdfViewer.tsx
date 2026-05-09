'use client'

import { useState } from 'react'

type Props = { pdfUrl: string }

export default function PdfViewer({ pdfUrl }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden w-full">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <span className="text-xs text-slate-400 font-medium">audit_report.pdf</span>
        <a
          href={pdfUrl}
          download="audit_report.pdf"
          className="flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-dark transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>
      </div>

      {/* Iframe */}
      <div className="relative w-full h-[70vh] min-h-[400px] sm:h-[76vh] lg:h-[82vh] xl:h-[86vh]">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
              <p className="text-sm text-slate-400">Loading report…</p>
            </div>
          </div>
        )}
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
          className="w-full h-full border-0"
          onLoad={() => setLoaded(true)}
          title="AI Spend Audit Report"
        />
      </div>
    </div>
  )
}
