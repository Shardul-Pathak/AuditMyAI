import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata = {
  title: 'Audit My AI - Reduce AI Tool Spending',
  description:
    'Audit your AI stack in minutes. Discover unused seats, overpriced plans, overlapping subscriptions, and hidden savings opportunities across ChatGPT, Claude, Cursor, Gemini, and more.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden bg-[#f8fafc] text-slate-950 antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
