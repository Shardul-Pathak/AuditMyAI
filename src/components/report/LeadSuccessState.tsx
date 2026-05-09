export default function LeadSuccessState() {
  return (
    <div className="w-full rounded-[32px] border border-white/60 bg-white/90 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_20px_80px_rgba(15,23,42,0.08)] text-center">
      <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center text-brand text-2xl mx-auto mb-6">✓</div>
      <h2 className="text-3xl font-bold text-slate-950 mb-3">Details Submitted</h2>
      <p className="text-slate-500 leading-relaxed max-w-md mx-auto mb-8">
        Your company profile has been saved. Continue to the AI spend audit to generate your optimization report.
      </p>
      <button className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(16,185,129,0.22)] hover:-translate-y-0.5 transition-all duration-300">
        Continue To Audit
      </button>
    </div>
  )
}
