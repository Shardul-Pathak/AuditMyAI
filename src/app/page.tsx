import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import PreviewCards from '@/components/PreviewCards'
import AuditForm from '@/components/AuditForm'
import HowItWorks from '@/components/HowItWorks'
import Savings from '@/components/Savings'
import FAQ from '@/components/FAQ'

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8fafc]">
      <Navbar />
      <Hero />
      <PreviewCards />
      <HowItWorks />
      <Savings />

      {/* Audit Form Section */}
      <section
        id="features"
        className="relative px-4 sm:px-6 py-20 sm:py-28"
      >
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[-120px] w-72 h-72 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute bottom-0 right-[-120px] w-72 h-72 rounded-full bg-emerald-200/20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-semibold text-brand uppercase tracking-[0.2em] mb-3">
              Free Audit
            </p>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold text-slate-950 tracking-tight leading-tight mb-5">
              Start saving on AI tools
              <br />
              before next month’s bill
            </h2>

            <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Submit your current AI stack and receive a personalized
              optimization report with estimated savings, unused seats,
              duplicate tools, and plan downgrade opportunities.
            </p>

          </div>

          {/* Form */}
          <AuditForm />

        </div>
      </section>

      <FAQ />
    </main>
  )
}
