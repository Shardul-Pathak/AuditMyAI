'use client'

import { useState } from 'react'

const navLinks = [
  'Features',
  'How It Works',
  'Savings',
  'FAQ',
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-[9999] w-full">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-4">

        {/* Navbar container */}
        <div
          className="
            relative z-50
            flex items-center justify-between
            rounded-full
            border border-white/60
            bg-white/80
            backdrop-blur-2xl
            px-4 sm:px-5
            py-3
            shadow-[0_10px_40px_rgba(15,23,42,0.06)]
          "
        >

          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0 min-w-0">

            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-brand/10 border border-brand/10 shrink-0">
              <img
                src="/logo.png"
                alt="Audit My AI"
                className="w-8 h-8 object-contain"
              />
            </div>

            <div className="flex flex-col leading-none min-w-0">

              <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-950 truncate">
                Audit My AI
              </span>

              <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">
                Optimize AI spending
              </span>

            </div>
          </div>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="
                    px-4 py-2 rounded-full
                    text-sm font-medium text-slate-600
                    hover:text-slate-950
                    hover:bg-slate-100/80
                    transition-all duration-200
                  "
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">

            <button
              className="
                cursor-pointer
                rounded-full
                bg-brand
                px-6 py-3
                text-sm font-medium text-white
                shadow-md shadow-brand/10
                transition-all duration-200
                hover:bg-brand-dark
                hover:shadow-lg
              "
            >
              Start Free Audit
            </button>

          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden flex flex-col gap-1.5 p-3 rounded-xl active:scale-95 transition-transform"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >

            <span
              className={`
                block w-5 h-0.5 bg-slate-700 rounded-full
                transition-all duration-300
                ${menuOpen ? 'rotate-45 translate-y-2' : ''}
              `}
            />

            <span
              className={`
                block w-5 h-0.5 bg-slate-700 rounded-full
                transition-all duration-300
                ${menuOpen ? 'opacity-0' : ''}
              `}
            />

            <span
              className={`
                block w-5 h-0.5 bg-slate-700 rounded-full
                transition-all duration-300
                ${menuOpen ? '-rotate-45 -translate-y-2' : ''}
              `}
            />

          </button>

        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            id="mobile-menu"
            role="menu"
            className="
              absolute left-0 right-0 top-[calc(100%+12px)]
              z-[9999]
              lg:hidden
              px-4 sm:px-6
            "
          >

            <div
              className="
                rounded-3xl
                border border-white/60
                bg-white/95
                backdrop-blur-2xl
                shadow-[0_20px_60px_rgba(15,23,42,0.08)]
                p-4
              "
            >

              <div className="flex flex-col gap-2">

                {navLinks.map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="
                      rounded-2xl
                      px-4 py-3
                      text-sm font-medium text-slate-700
                      hover:bg-slate-100
                      transition-colors
                    "
                    onClick={() => setMenuOpen(false)}
                  >
                    {link}
                  </a>
                ))}

                <button
                  className="
                    mt-2
                    w-full
                    rounded-2xl
                    bg-brand
                    px-5 py-3.5
                    text-sm font-semibold text-white
                    shadow-[0_10px_30px_rgba(16,185,129,0.22)]
                    transition-all duration-200
                    hover:bg-brand-dark
                  "
                >
                  Start Free Audit
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </nav>
  )
}
