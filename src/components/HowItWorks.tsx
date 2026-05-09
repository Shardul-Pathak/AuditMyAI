const steps = [
  {
    number: '01',
    title: 'Connect Your AI Stack',
    description:
      'Add the AI tools, plans, seats, and monthly spend your team currently uses.',
  },
  {
    number: '02',
    title: 'Analyze Usage & Spend',
    description:
      'We identify inactive seats, duplicate subscriptions, oversized plans, and hidden waste.',
  },
  {
    number: '03',
    title: 'Receive Optimization Report',
    description:
      'Get a clear breakdown of savings opportunities and actionable recommendations.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative px-6 py-24"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="max-w-2xl mb-14">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-3">
            How It Works
          </p>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950 leading-tight mb-5">
            Audit your AI spend in minutes
          </h2>

          <p className="text-slate-500 text-base leading-relaxed">
            Built for teams scaling fast with AI tools and APIs.
            No spreadsheets. No manual cost reviews.
          </p>

        </div>

        {/* Steps */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {steps.map((step) => (
            <div
              key={step.number}
              className="
                relative overflow-hidden
                rounded-[32px]
                border border-slate-200/70
                bg-white/80 backdrop-blur-xl
                p-8
                shadow-[0_20px_60px_rgba(15,23,42,0.06)]
              "
            >

              <div className="w-14 h-14 rounded-2xl bg-brand-light flex items-center justify-center text-brand font-bold text-lg mb-8">
                {step.number}
              </div>

              <h3 className="text-2xl font-bold text-slate-950 mb-4">
                {step.title}
              </h3>

              <p className="text-slate-500 leading-relaxed text-sm">
                {step.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  )
}
