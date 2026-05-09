const CARD = 'w-full max-w-3xl mx-auto rounded-[32px] border border-white/60 bg-white/90 backdrop-blur-2xl p-10 text-center shadow-[0_20px_80px_rgba(15,23,42,0.08)]'

export function LoadingState({ progress }: { progress: number }) {
  return (
    <div className={CARD}>
      <div className="w-20 h-20 rounded-full border-4 border-brand/20 border-t-brand animate-spin mx-auto mb-8" />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-3">Audit In Progress</p>
      <h2 className="text-3xl font-bold text-slate-950 mb-4">Analyzing AI Spend</h2>
      <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
        Detecting duplicate tools, inactive seats, inefficient plans, and optimization opportunities.
      </p>
      <div className="w-full max-w-md mx-auto h-3 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-4 text-sm font-semibold text-brand">{progress}% Complete</p>
    </div>
  )
}

export function SuccessState({
  estimatedSavings,
  onReset,
}: {
  estimatedSavings: number
  onReset: () => void
}) {
  return (
    <div className={CARD}>
      <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center text-brand text-2xl mx-auto mb-6">✓</div>
      <h2 className="text-3xl font-bold text-slate-950 mb-3">Audit Completed</h2>
      <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
        Your AI stack contains multiple optimization opportunities across seats, subscriptions, and usage patterns.
      </p>
      <div className="rounded-3xl bg-brand-light p-8 mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-3">Estimated Monthly Savings</p>
        <p className="text-5xl font-bold text-brand">${estimatedSavings}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(16,185,129,0.22)]">
          View Full Report
        </button>
        <button
          onClick={onReset}
          className="rounded-full border border-slate-200 px-7 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          Re-fill Form
        </button>
      </div>
    </div>
  )
}
