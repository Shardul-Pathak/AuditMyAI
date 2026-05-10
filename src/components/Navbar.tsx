'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

const NAV_LINKS = ['How It Works', 'Savings', 'FAQ']

function toAnchor(label: string) {
  return `#${label.toLowerCase().replace(/\s+/g, '-')}`
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const mounted = typeof window !== 'undefined'

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const dropdown = (
    <div
      id="mobile-menu"
      role="menu"
      className="fixed inset-0 z-[99999]"
      onClick={() => setMenuOpen(false)}
    >
      <div className="absolute inset-0 bg-slate-900/30" />

      <div
        className="absolute top-3 left-3 right-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.15)] p-4">

          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[15px] font-semibold text-slate-950">Audit My AI</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center text-lg border-none cursor-pointer"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={toAnchor(link)}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-2xl text-[15px] font-medium text-slate-700 no-underline hover:bg-slate-50 active:bg-slate-100"
              >
                {link}
              </a>
            ))}

            <a href='#features' className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-all duration-200">
              <button
                onClick={() => setMenuOpen(false)}
                className="mt-2 w-full rounded-2xl bg-brand px-5 py-3.5 text-[15px] font-semibold text-white border-none cursor-pointer hover:bg-brand-dark"
              >
                Start Free Audit
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <nav className="sticky top-0 z-[9999] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
          <div className="flex items-center justify-between rounded-full border border-white/60 bg-white/80 backdrop-blur-2xl px-4 sm:px-5 py-3 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand/10 border border-brand/10 shrink-0">
                <Image src="/logo.png" alt="Audit My AI" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" width={24} height={24} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-950">Audit My AI</span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Optimize AI spending</span>
              </div>
            </div>

            <ul className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link}>
                  <a href={toAnchor(link)} className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-all duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            <a href='#features' className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-all duration-200">
              <button className="hidden lg:flex cursor-pointer rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-brand/10 transition-all duration-200 hover:bg-brand-dark hover:shadow-lg">
                Start Free Audit
              </button>
            </a>

            <button
              type="button"
              className="lg:hidden flex flex-col gap-1.5 p-2.5 rounded-xl active:scale-95 transition-transform"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <span className="block w-5 h-0.5 bg-slate-700 rounded-full" />
              <span className="block w-5 h-0.5 bg-slate-700 rounded-full" />
              <span className="block w-5 h-0.5 bg-slate-700 rounded-full" />
            </button>

          </div>
        </div>
      </nav>

      {mounted && menuOpen && createPortal(dropdown, document.body)}
    </>
  )
}
