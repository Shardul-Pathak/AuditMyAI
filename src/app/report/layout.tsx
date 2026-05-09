import type { Metadata } from 'next'

export const metadata = {
  title: 'AI Spend Audit Report',
  description:
    'View your AI spend audit report with savings opportunities, optimization insights, and personalized recommendations.',
  keywords: [
    'AI spend audit',
    'AI cost optimization',
    'ChatGPT pricing',
    'Claude pricing',
    'Cursor pricing',
    'AI SaaS optimization',
    'reduce AI costs',
    'AI infrastructure audit',
  ],
}

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-950">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div
          className="
            absolute top-[-120px] left-[-80px]
            w-[420px] h-[420px]
            rounded-full bg-brand/10 blur-3xl
          "
        />

        <div
          className="
            absolute bottom-[-120px] right-[-80px]
            w-[420px] h-[420px]
            rounded-full bg-emerald-200/20 blur-3xl
          "
        />
      </div>
      {children}
    </div>
  )
}
