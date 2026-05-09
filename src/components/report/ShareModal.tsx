'use client'

import { useState } from 'react'

type Props = { onClose: () => void }

export default function ShareModal({ onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareLinks = [
    {
      label: 'Email',
      icon: '✉️',
      href: `mailto:?subject=AI Spend Audit Report&body=Check out this AI spend audit: ${url}`,
    },
    {
      label: 'LinkedIn',
      icon: 'in',
      href: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: 'Twitter / X',
      icon: '𝕏',
      href: `https://twitter.com/intent/tweet?text=Just audited our AI stack and found $642/mo in savings.&url=${encodeURIComponent(url)}`,
    },
  ]

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40" />
      <div
        className="relative bg-white rounded-[30px] border border-slate-100 shadow-[0_30px_80px_rgba(15,23,42,0.18)] p-6 sm:p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-950">Share this report</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Copy link */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 truncate">
            {url}
          </div>
          <button
            onClick={handleCopy}
            className={`rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer shrink-0
              ${copied ? 'bg-emerald-500 text-white' : 'bg-brand text-white hover:bg-brand-dark'}`}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Share via */}
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Share via</p>
        <div className="flex flex-col gap-3">
          {shareLinks.map(({ label, icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-slate-100 px-5 py-4 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all"
            >
              <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-base font-bold">
                {icon}
              </span>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
