const metrics = [
  {
    label: 'Average Monthly Savings',
    value: '$642',
    note: 'Per team after optimization',
  },
  {
    label: 'Unused Seats Detected',
    value: '18%',
    note: 'Average inactive subscriptions',
  },
  {
    label: 'Duplicate Tool Spend',
    value: '$1.8k',
    note: 'Typical overlapping annual cost',
  },
]

export default function Savings() {
  return (
    <section
      id="savings"
      className="relative px-6 py-24"
    >
      <div className="max-w-7xl mx-auto">

        <div
          className="
            relative overflow-hidden
            rounded-[40px]
            border border-white/60
            bg-white/80 backdrop-blur-2xl
            px-6 py-12 md:px-12 md:py-16
            shadow-[0_25px_80px_rgba(15,23,42,0.08)]
          "
        >

          {/* Background glow */}

          <div className="absolute top-0 right-0 w-72 h-72 bg-brand/10 blur-3xl rounded-full" />

          <div className="relative z-10">

            {/* Header */}

            <div className="max-w-2xl mb-14">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-3">
                Savings Insights
              </p>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950 leading-tight mb-5">
                Most teams overspend on AI tools
              </h2>

              <p className="text-slate-500 text-base leading-relaxed">
                Subscription overlap, inactive seats, and unmanaged API usage quietly increase monthly AI costs.
              </p>

            </div>

            {/* Metrics */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="
                    rounded-[30px]
                    border border-slate-200/70
                    bg-white/90
                    p-8
                  "
                >

                  <p className="text-sm font-medium text-slate-500 mb-6">
                    {metric.label}
                  </p>

                  <p className="text-5xl font-bold tracking-tight text-slate-950 mb-3">
                    {metric.value}
                  </p>

                  <p className="text-sm text-slate-500">
                    {metric.note}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
