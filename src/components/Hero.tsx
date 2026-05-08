export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center px-4 sm:px-6 pt-12 pb-6 max-w-7xl mx-auto">

      {/* Headline */}
      <h1 className="text-[clamp(1.75rem,5.5vw,3.75rem)] font-bold text-slate-950 leading-[1.08] md:leading-[1.1] tracking-tight mb-5 max-w-[min(90vw,900px)]">
        Stop Overpaying <br />
        for <em className="italic font-bold">AI Tools</em>
      </h1>

      {/* Subtitle */}
      <p className="text-sm md:text-[15px] text-slate-600 max-w-xs sm:max-w-md md:max-w-lg leading-relaxed mb-9">
        Audit your AI stack in minutes. Discover unused seats,
        overpriced plans, overlapping tools, and hidden savings
        opportunities across ChatGPT, Claude, Cursor, Gemini, and more.
      </p>

      {/* CTA Button */}
      <button className="cursor-pointer group flex items-center gap-3 bg-brand hover:bg-brand-dark transition-colors duration-200 text-white text-sm font-medium px-6 md:px-7 py-3.5 rounded-full shadow-md shadow-brand/10 hover:shadow-lg h-10 md:h-11">
        <span className="w-5 h-5 rounded-full transition-colors flex items-center justify-center text-base leading-none select-none">
          →
        </span>
        Start Free Audit
      </button>

    </section>
  )
}
