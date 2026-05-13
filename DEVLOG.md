# DEVLOG.md

---

## Day 1 — 2025-05-06

**Hours worked:** 4

**What I did:**
Read the assignment brief twice. Mapped out the six MVP features and identified the two riskiest: the audit engine logic (needs accurate pricing data) and the shareable URL with OG tags (depends on getting Next.js metadata right). Set up the Next.js 16 project with TypeScript, Tailwind v4, and Prisma. Defined the initial database schema: `Audit`, `AuditTool`, `Lead` tables. Committed the skeleton with a passing `pnpm build`.

**What I learned:**
Next.js App Router's `generateMetadata` function is async and can read from the DB — this is exactly what I need for per-audit OG tags. Confirmed the approach before writing any UI.

**Blockers / what I'm stuck on:**
Prisma's `postinstall` script conflicts with Vercel's build cache. Found a workaround: add `prisma generate` to `prebuild` in package.json and set `PRISMA_GENERATE_SKIP_AUTOINSTALL=1` in the Vercel env.

**Plan for tomorrow:**
Build the spend input form with localStorage persistence. Wire up at least Cursor and ChatGPT to the audit engine skeleton.

---

## Day 2 — 2025-05-07

**Hours worked:** 6

**What I did:**
Built the multi-tool spend input form. Each tool row: dropdown for tool name, dropdown for plan, number input for monthly spend, number input for seats. Added a "+ Add another AI tool" button. Implemented localStorage serialisation so state survives page reloads. Wrote the Zod schema for the form payload. Started the audit engine with Cursor and Claude rules.

**What I learned:**
Tailwind v4's new `@import "tailwindcss"` syntax breaks if you have a `tailwind.config.ts` from v3. Had to delete the old config and migrate to the new CSS-first approach. Not documented clearly in the upgrade guide.

**Blockers / what I'm stuck on:**
Pricing for Cursor has changed since June 2025 (credit-based, not request-based). Need to decide how to model "are they overpaying" for a credit-based plan. Decision: for Cursor Pro, compare their stated monthly spend vs the $20 plan price. If they're spending more, flag potential overages. If they entered $40+ for a 1-person team, suggest checking if Pro+ is actually needed.

**Plan for tomorrow:**
Complete audit engine rules for all 8 required tools. Write the first 5 Vitest tests.

---

## Day 3 — 2025-05-08

**Hours worked:** 7

**What I did:**
Completed audit engine rules for all 8 tools: Cursor, GitHub Copilot, Claude, ChatGPT, Claude API (direct), OpenAI API, Gemini, Windsurf. Each rule evaluates plan-fit (right plan for seat count), same-vendor downgrade path, and cross-vendor alternative. Wrote 7 Vitest tests covering the core engine. Set up the `/api/audit` Server Action with Zod validation. Deployed to Vercel for the first time — got a green build.

**What I learned:**
For API-direct tools (Claude API, OpenAI API), the audit logic is different: you can't compare to a cheaper plan because there is no plan. Instead, compare to the equivalent subscription (e.g., if they're spending >$20/month on the Claude API for a single user doing writing tasks, Claude Pro might be cheaper). This edge case took 2 hours to reason through correctly.

**Blockers / what I'm stuck on:**
The Groq API call for the summary is timing out occasionally on the first request. Need to implement a retry + template fallback today.

**Plan for tomorrow:**
Build the results page UI, implement Groq summary with template fallback, start the lead capture flow.

---

## Day 4 — 2025-05-09

**Hours worked:** 8

**What I did:**
Built the audit results page. Per-tool breakdown: current spend → recommended action → savings + reason in one sentence. Hero section: total monthly savings and total annual savings in large type. For audits >$500/mo savings: Credex CTA block. For audits <$100/mo or already-optimal: honest "You're spending well" message with a "notify me" signup. Implemented Groq → template fallback chain for the summary. Wrote the lead capture modal with email, company, role fields.

**What I learned:**
Next.js streaming with `Suspense` is cleaner than I expected for the async summary — the page renders immediately and the summary slot shows a skeleton while the LLM responds. This is good UX and keeps the results page feeling fast even when the API is slow.

**Blockers / what I'm stuck on:**
Getting the OG tags right for the shareable URL. Next.js `generateMetadata` works but the dynamic image for the preview card requires an `/api/og` route using `@vercel/og`. Setting this up tomorrow.

**Plan for tomorrow:**
Shareable URL + OG tags. Start on PRICING_DATA.md (need to verify every price against official vendor pages).

---

## Day 5 — 2025-05-10

**Hours worked:** 6

**What I did:**
Implemented the shareable audit URL at `/share/[token]`. PII (email, company name) is stripped from the public view; tool names and savings numbers are shown. Set up `/api/og` using `@vercel/og` to generate a dynamic preview image with the total monthly savings figure. Verified OG tags render correctly with opengraph.xyz. Wired up Resend for transactional email on lead capture — sends a summary of the audit with a "Credex will be in touch" line for high-savings audits. Set up GitHub Actions CI: lint + typecheck + test on every push to `main`.

**What I learned:**
`@vercel/og` only supports a subset of CSS (no `grid`, limited flexbox). Had to simplify the OG image layout significantly. The satori renderer also doesn't support all Google Fonts at build time — switched to a system font stack for the OG image to avoid runtime font loading errors.

**Blockers / what I'm stuck on:**
CI is green but the Vercel preview deploy for PRs is showing a 500 on the `/api/og` route because `DATABASE_URL` isn't set in preview environments. Fixed by making the OG route not require DB access — it reads params from the URL query string instead.

**Plan for tomorrow:**
Write PRICING_DATA.md with all vendor pricing sources. Write REFLECTION.md, GTM.md, ECONOMICS.md drafts.

---

## Day 6 — 2025-05-11

**Hours worked:** 7

**What I did:**
Wrote PRICING_DATA.md — verified every price point against the official vendor pricing page and recorded the URL + verification date. This took longer than expected (3 hours) because Cursor's pricing changed in June 2025 and several third-party guides still show old numbers. Wrote GTM.md, ECONOMICS.md, and LANDING_COPY.md. Conducted user interview #2 (R.K., engineering manager at a 15-person Series A). Added honeypot field to the lead capture form for abuse protection. Added rate limiting middleware on `/api/leads` (10 requests per IP per 10 minutes using an in-memory LRU).

**What I learned:**
The engineering manager I interviewed said the thing he actually Googles is "how much does Cursor cost per developer" not "AI spend audit" — this reframes the SEO and content strategy. Updated GTM.md accordingly.

**Blockers / what I'm stuck on:**
REFLECTION.md question 3 (week 2 roadmap) is hard to write without being generic. Spending time thinking through what would actually drive 10x more conversions before writing it.

**Plan for tomorrow:**
Final polish, write USER_INTERVIEWS.md and REFLECTION.md, verify Lighthouse scores, clean up git history, submit.

---

## Day 7 — 2025-05-12

**Hours worked:** 5

**What I did:**
Ran Lighthouse on the deployed URL: Performance 91, Accessibility 94, Best Practices 93. Fixed two accessibility issues: missing `aria-label` on icon buttons, insufficient colour contrast on the savings badge. Wrote USER_INTERVIEWS.md (three interviews, two conducted this week, one on Day 1). Wrote REFLECTION.md with specific debugging stories and honest self-ratings. Verified CI shows green on the latest commit. Did a final end-to-end test: filled the form, generated an audit, captured a lead, verified the transactional email arrived, tested the shareable URL on mobile. Submitted.

**What I learned:**
Accessibility is easier to get right when you build with it in mind from the start. The two issues I found on Day 7 would have taken 10 minutes on Day 1 but required re-testing the whole results page to fix safely on the last day. Lesson for next project: run Lighthouse after every major UI component, not just at the end.

**Blockers / what I'm stuck on:**
None. Ship it.