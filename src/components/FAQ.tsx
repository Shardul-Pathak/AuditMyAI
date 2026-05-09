'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'What does Audit My AI analyze?',
    answer:
      'We analyze AI subscriptions, API spend, inactive seats, duplicate tools, and plan inefficiencies across your AI stack.',
  },
  {
    question: 'Which AI tools are supported?',
    answer:
      'Audit My AI supports ChatGPT, Claude, Cursor, Gemini, GitHub Copilot, OpenAI API, Anthropic API, and other major AI products.',
  },
  {
    question: 'How long does the audit take?',
    answer:
      'Most audits are completed within a few minutes depending on the size of your AI stack.',
  },
  {
    question: 'Do I need to connect billing accounts?',
    answer:
      'No. You can manually enter your tools and estimated spend to receive optimization recommendations.',
  },
  {
    question: 'How accurate are the savings estimates?',
    answer:
      'Savings estimates are based on seat utilization, pricing comparisons, overlapping subscriptions, and typical optimization patterns.',
  },
]

export default function FAQ() {
  const [active, setActive] = useState<number | null>(0)

  return (
    <section
      id="faq"
      className="relative px-6 py-24"
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="text-center mb-14">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-3">
            FAQ
          </p>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950 leading-tight mb-5">
            Common questions
          </h2>

          <p className="text-slate-500 text-base leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about AI spend audits and optimization reports.
          </p>

        </div>

        {/* FAQ List */}

        <div className="space-y-4">

          {faqs.map((faq, index) => {
            const isActive = active === index

            return (
              <div
                key={faq.question}
                className="
                  rounded-[28px]
                  border border-slate-200/70
                  bg-white/80 backdrop-blur-xl
                  overflow-hidden
                  shadow-[0_10px_40px_rgba(15,23,42,0.04)]
                "
              >

                <button
                  onClick={() =>
                    setActive(isActive ? null : index)
                  }
                  className="
                    w-full flex items-center justify-between
                    gap-6 text-left
                    px-6 py-5
                    cursor-pointer
                  "
                >

                  <span className="text-base sm:text-lg font-semibold text-slate-950">
                    {faq.question}
                  </span>

                  <span
                    className={`
                      text-brand text-2xl transition-transform duration-300
                      ${isActive ? 'rotate-45' : ''}
                    `}
                  >
                    +
                  </span>

                </button>

                <div
                  className={`
                    grid transition-all duration-300
                    ${isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
                  `}
                >

                  <div className="overflow-hidden">

                    <p className="px-6 pb-6 text-sm leading-relaxed text-slate-500">
                      {faq.answer}
                    </p>

                  </div>

                </div>

              </div>
            )
          })}

        </div>

      </div>
    </section>
  )
}
