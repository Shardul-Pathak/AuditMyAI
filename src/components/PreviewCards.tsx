function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`
        bg-white/95 backdrop-blur-xl
        rounded-[30px]
        border border-white/70
        p-5
        shadow-[0_25px_80px_rgba(15,23,42,0.08)]
        transform-gpu will-change-transform ${className}
      `}
    >
      {children}
    </div>
  )
}

function Badge({
  text,
  bg,
  color,
}: {
  text: string
  bg: string
  color: string
}) {
  return (
    <span
      className={`
        px-2.5 py-1 rounded-full
        text-[10px] font-semibold
        ${bg} ${color}
      `}
    >
      {text}
    </span>
  )
}

function AuditCard() {
  return (
    <Card className="w-full max-w-[288px] -rotate-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-slate-500 font-medium tracking-wide">
          AI Spend Audit
        </span>

        <span className="w-7 h-7 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-sm font-semibold">
          ✓
        </span>
      </div>

      {/* Savings */}
      <p className="text-3xl font-bold text-slate-950 tracking-tight mb-2">
        Save $642/mo
      </p>

      <p className="text-sm text-slate-400 leading-relaxed mb-6">
        Unused seats and overlapping subscriptions detected across your AI stack.
      </p>

      {/* Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">
            Downgrade inactive seats
          </span>

          <Badge
            text="+$220"
            bg="bg-green-50"
            color="text-green-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">
            Remove duplicate tools
          </span>

          <Badge
            text="+$180"
            bg="bg-blue-50"
            color="text-blue-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">
            Optimize API usage
          </span>

          <Badge
            text="+$242"
            bg="bg-purple-50"
            color="text-purple-600"
          />
        </div>
      </div>
    </Card>
  )
}

function SavingsCard() {
  return (
    <Card className="w-full max-w-[340px] py-7 px-6 relative z-10 sm:scale-110 scale-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-slate-500 font-medium tracking-wide">
          Monthly AI Spend
        </span>

        <span className="w-8 h-8 rounded-full bg-brand-light text-brand flex items-center justify-center text-sm">
          ↘
        </span>
      </div>

      {/* Before / After */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400">
            Current Spend
          </span>

          <span className="text-lg font-semibold text-slate-400 line-through">
            $2,340/mo
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">
            Optimized Spend
          </span>

          <span className="text-4xl font-bold text-slate-950 tracking-tight">
            $1,698
          </span>
        </div>
      </div>

      {/* Savings box */}
      <div className="bg-brand-light rounded-2xl p-5">
        <p className="text-[11px] text-brand font-semibold uppercase tracking-[0.2em] mb-2">
          Annual Savings
        </p>

        <p className="text-3xl font-bold text-brand tracking-tight">
          $7,704
        </p>

        <p className="text-sm text-slate-500 leading-relaxed mt-2">
          Reduce unnecessary AI costs without impacting productivity.
        </p>
      </div>
    </Card>
  )
}

const bars = [
  { label: 'GPT', height: 'h-16', active: false },
  { label: 'Claude', height: 'h-12', active: false },
  { label: 'Cursor', height: 'h-24', active: true },
  { label: 'Gemini', height: 'h-8', active: false },
]

function InsightsCard() {
  return (
    <Card className="w-full max-w-[288px] rotate-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-slate-500 font-medium tracking-wide">
          Spend Insights
        </span>

        <svg
          className="w-5 h-5 text-brand"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3v18h18"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 14l4-4 3 3 5-7"
          />
        </svg>
      </div>

      {/* Insight */}
      <p className="text-lg font-bold text-slate-900 leading-snug mb-2">
        Cursor accounts for 42% of total AI spend
      </p>

      <p className="text-sm text-slate-400 leading-relaxed mb-6">
        Most waste comes from inactive premium seats and duplicated workflows.
      </p>

      {/* Bar chart */}
      <div className="flex items-end justify-between h-28">
        {bars.map(({ label, height, active }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`
                w-8 rounded-t-2xl transition-all
                ${height}
                ${active ? 'bg-brand' : 'bg-brand-light'}
              `}
            />

            <span className="text-[10px] text-slate-400 font-medium">
              {label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function PreviewCards() {
  return (
    <section className="relative flex justify-center items-end gap-6 px-4 sm:px-6 pt-12 pb-24 flex-wrap md:flex-nowrap max-w-7xl mx-auto box-border">

      {/* Background glow (contained) */}
      <div className="absolute bottom-8 left-0 right-0 mx-auto w-[min(90vw,700px)] h-[min(40vh,320px)] bg-brand/10 blur-3xl rounded-full pointer-events-none" />

      {/* Left stack */}
      <div className="flex flex-col gap-5 md:translate-y-8 relative z-10 w-full max-w-[280px] sm:max-w-[288px] flex-shrink-0">
        <AuditCard />
      </div>

      {/* Center card */}
      <div className="relative z-20 w-full sm:w-[340px] max-w-[340px] flex-shrink-0">
        <SavingsCard />
      </div>

      {/* Right card */}
      <div className="relative z-10 md:-translate-y-1 w-full max-w-[288px] sm:max-w-[288px] flex-shrink-0">
        <InsightsCard />
      </div>

    </section>
  )
}
