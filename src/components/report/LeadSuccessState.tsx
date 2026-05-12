import Link from 'next/link'

type Props = {
  publicId: string
  emailSent: boolean
  emailError?: string
}

export default function LeadSuccessState({ publicId, emailSent, emailError }: Props) {
  return (
    <div className="w-full rounded-[32px] border border-white/60 bg-white/90 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_20px_80px_rgba(15,23,42,0.08)] text-center">
      <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center text-brand text-2xl mx-auto mb-6">✓</div>
      <h2 className="text-3xl font-bold text-slate-950 mb-3">You&apos;re all set</h2>
      {emailSent ? (
        <p className="text-slate-500 leading-relaxed max-w-md mx-auto mb-8">
          Your profile is saved and we&apos;ve sent your personalized audit PDF to your work email. You can also open
          your live report anytime.
        </p>
      ) : (
        <p className="text-slate-500 leading-relaxed max-w-md mx-auto mb-8">
          Your profile is saved.{' '}
          {emailError ? (
            <>
              We couldn&apos;t send the email: <span className="text-slate-600">{emailError}</span>. You can still
              view your report below.
            </>
          ) : (
            <>We couldn&apos;t send the email right now. You can still view your report below.</>
          )}
        </p>
      )}
      <Link
        href={`/report/${encodeURIComponent(publicId)}`}
        className="inline-flex rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(16,185,129,0.22)] hover:-translate-y-0.5 transition-all duration-300"
      >
        View your report
      </Link>
    </div>
  )
}
