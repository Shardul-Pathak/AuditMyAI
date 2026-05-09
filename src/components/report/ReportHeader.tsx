type Props = {
  savings: number
  annualSavings: number
  onShare: () => void
  onGetMail: () => void
}

export default function ReportHeader({ savings, annualSavings, onShare, onGetMail }: Props) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Audit Completed
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 leading-tight">
              AI Spend Audit Report
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed">
              Analysis of your AI subscriptions, seat allocation, platform overlap, and optimization opportunities.
            </p>
          </div>

          <div className="w-full lg:max-w-sm rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 sm:p-8 text-white shadow-[0_20px_80px_rgba(16,185,129,0.25)]">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-100 mb-3">Estimated Savings</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl sm:text-6xl font-bold">${savings}</span>
              <span className="text-lg text-emerald-100 mb-2">/mo</span>
            </div>
            <div className="mt-6 h-px bg-white/20" />
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-100 uppercase tracking-wide">Annual Savings</p>
                <p className="text-2xl font-bold mt-1">${annualSavings.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs text-emerald-100">Waste Reduction</p>
                <p className="text-xl font-bold">28%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 hidden sm:grid gap-4 sm:grid-cols-2 lg:max-w-xl">
          <button
            type="button"
            onClick={onGetMail}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(16,185,129,0.25)] transition-colors hover:bg-brand-dark"
          >
            <span>Get Report via Mail</span>
          </button>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <span>Share Report</span>
          </button>
        </div>
      </div>
    </section>
  )
}
