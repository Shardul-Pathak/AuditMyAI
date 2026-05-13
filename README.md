# AuditMyAI

AuditMyAI is a free web app that audits your team's AI tool spend in minutes — identifying overpaid plans, unused seats, overlapping subscriptions, and cheaper alternatives — and surfaces Credex as the solution for high-savings cases. Built for startup founders and engineering managers who want a second opinion on their AI budget without hiring a consultant.

**Live URL:** https://audit-my-ai.vercel.app

---

## Screenshots / Demo

**Watch a walkthrough:** https://www.loom.com/share/ed67aee74d2a4ff2980f7620e3365534

---

## Quick Start

### Prerequisites

- Node.js 16+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database (local or hosted — Supabase / Neon / Render recommended)
- Groq API key (for AI-generated summaries — get one free at console.groq.com)
- Resend API key (for transactional email)

### Install & Run Locally

```bash
git clone https://github.com/Shardul-Pathak/AuditMyAI.git
cd AuditMyAI

# Install dependencies
pnpm install

# Copy env template and fill in your values
cp .env.example .env.local
# Required vars: DATABASE_URL, GROQ_API_KEY, RESEND_API_KEY

# Push database schema
pnpm db:migrate

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run Tests

```bash
pnpm test
```

### Deploy

The project is configured for one-click Vercel deploy:

```bash
# Set environment variables in Vercel dashboard, then:
vercel --prod
```

---

## Decisions

Five non-trivial trade-offs made during the build:

| # | Decision | Why |
|---|----------|-----|
| 1 | **Hardcoded audit rules, not AI** | The audit math (plan comparisons, seat overuse detection) needs to be deterministic and auditable. A finance person should be able to read the rules and agree with them. Using an LLM for this would introduce hallucinated savings numbers, which destroys trust. AI is reserved for the qualitative narrative summary where creative language is appropriate. |
| 2 | **Email captured after results, never before** | Showing value before asking for contact details is the only pattern that converts cold traffic. Gating before results would tank the completion rate and undermine the tool's credibility as a genuinely useful product rather than a lead-gen trick. |
| 3 | **Prisma + Postgres over Supabase JS SDK** | Prisma gives type-safe queries that catch schema drift at compile time. Supabase's JS SDK auto-generates types but the DX degrades on complex queries. The Prisma layer also makes it easy to swap database providers (Render, Neon, Supabase) without changing application code. |
| 4 | **Next.js App Router over Pages Router** | Server Components let the audit results page be rendered server-side with the correct Open Graph tags for each unique audit URL — critical for the shareable-link viral loop. Pages Router would require a separate API route and client hydration to achieve the same OG behavior. |
| 5 | **Groq for AI-generated summaries** | Groq's inference speed (~300 ms for a 100-word paragraph using Llama-3-70b) makes it the right choice for a synchronous summary that renders alongside the results page. The fast latency means users don't notice any delay — the summary appears almost immediately after results load. On API failure, the system falls back to a deterministic template string so the page is never broken. The fallback is disclosed in PROMPTS.md. |

---

**Deployed at:** https://audit-my-ai.vercel.app  
**Repo:** https://github.com/Shardul-Pathak/AuditMyAI