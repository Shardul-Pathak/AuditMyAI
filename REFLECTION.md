# REFLECTION.md

---

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug was a silent data corruption issue in the audit engine. When a user added two tools and then removed the first one, the second tool's audit result was being attributed to the wrong tool in the database. The savings numbers were right, but the tool names were swapped in the results page. This only manifested when tools were added out-of-order, so it didn't show up in my initial happy-path tests.

My first hypothesis was a React state bug — maybe the `useState` array wasn't being indexed correctly after a splice. I added `console.log` statements throughout the form state update handlers and confirmed the frontend state was correct after removal. So the bug was downstream.

My second hypothesis was in the Server Action. I added `console.log` to the server-side audit function and found the tools array was arriving in the correct order. So it wasn't a serialisation issue.

My third hypothesis was the database write. The Prisma `createMany` call for `AuditTool` records was using the array index as the ordering key — but I was also passing a separate `position` field that I'd added to the schema without running a migration. Prisma silently ignored the unrecognised field and fell back to insertion order, which differed from array index after a delete.

Fix: ran `pnpm db:migrate`, which applied the pending migration and added the `position` column. The `createMany` call then used `position` correctly. Total debugging time: about 90 minutes. The lesson was to check pending migrations before assuming application logic is wrong.

---

## 2. A decision I reversed mid-week, and what made me reverse it

On Day 2, I decided to use Supabase's JS client (`@supabase/supabase-js`) instead of Prisma for the database layer. My reasoning at the time was that Supabase's auto-generated TypeScript types would save setup time.

I reversed this on Day 3 after running into a specific problem: I needed to run a single database write that inserted an `Audit` record and multiple `AuditTool` records in a transaction, and if either failed, I wanted a clean rollback. The Supabase JS client doesn't support multi-table transactions natively — you need to write a Postgres function and call it via RPC. That felt like more work than just switching to Prisma, which has first-class `prisma.$transaction` support.

The deeper lesson: Supabase's JS client is excellent for simple CRUD on a single table, but Prisma is clearly better for relational write operations where integrity matters. I'd use the same heuristic on future projects.

---

## 3. What I would build in week 2

**Priority 1: Benchmark mode.** Right now the tool only tells you what you could save. It doesn't tell you whether you're spending normally. Adding a benchmark — "your AI spend per developer is $X, companies your size average $Y" — makes the audit more credible and more shareable. The data source would be anonymised, aggregated audit submissions from week 1 users.

**Priority 2: PDF export.** The results page is the thing that gets screenshotted and forwarded to a CFO or a board. A clean PDF export (using the `@sparticuz/chromium` dependency already in the package.json) would increase the tool's utility in procurement conversations and increase the quality of leads that reach Credex.

**Priority 3: Embeddable widget.** A `<script>` tag that a blogger or newsletter author could drop into their content to run a quick 3-field audit (main tool, plan, team size) inline. This is the distribution channel that doesn't require anyone to click a link — it meets the user where they're already reading about AI tools.

**Priority 4: Pricing data freshness pipeline.** Right now PRICING_DATA.md is a static document I update manually. A lightweight cron job (Vercel Cron + Playwright) that scrapes the 8 official pricing pages nightly and alerts me to changes would keep the audit engine accurate without manual work.

---

## 4. How I used AI tools

I used Claude (Sonnet 4, via claude.ai) and GitHub Copilot (Pro) throughout the week. Here's the breakdown:

**What I used AI for:**
- Generating the initial Prisma schema from a verbal description of the data model.
- Drafting Zod validation schemas (Claude was good at this).
- Writing the Resend email template HTML (Copilot was faster here — it autocompleted React email components correctly).
- Generating the first draft of the Mermaid architecture diagram.
- Suggesting test cases I hadn't thought of (Claude identified the out-of-order deletion edge case that I later found as a real bug — I hadn't written a test for it yet).

**What I didn't trust AI for:**
- The audit engine pricing logic. Every pricing number had to be verified by me against the official vendor page. Claude confidently cited a Cursor Pro price of "$20/month including 500 fast requests" which was the pre-June 2025 model — wrong for submission week. I caught this when cross-referencing with cursor.com/pricing.
- The user interviews. These had to be real conversations with real people.
- The economics and GTM sections. AI-generated versions of these are generic and obvious. The insight that engineering managers Google "how much does Cursor cost per developer" rather than "AI spend audit" came from an actual conversation.

**One specific time the AI was wrong:**
On Day 3 I asked Claude to help me write the cross-vendor recommendation logic for the case where someone is on ChatGPT Plus for coding tasks and Cursor Pro simultaneously. Claude suggested: "If the user's primary use case is coding and they're on both ChatGPT Plus and Cursor Pro, recommend dropping ChatGPT Plus entirely." This is wrong — ChatGPT Plus and Cursor serve different jobs (general reasoning vs. IDE-native autocomplete). A user doing coding work often legitimately needs both. I caught this by thinking about the user's actual workflow rather than accepting the model's surface-level pattern-match.

---

## 5. Self-ratings

| Dimension | Score | Reason |
|-----------|-------|--------|
| **Discipline** | 7/10 | I committed on 6 of the 7 days and spread the work reasonably across the week. Day 1 was lighter than it should have been — I spent too long planning and not enough time shipping. |
| **Code quality** | 7/10 | TypeScript throughout, Zod validation on all API boundaries, no `any` types, consistent naming. Lost a point for the Prisma migration oversight that caused the Day 3 bug, and another for not having enough test coverage on the cross-vendor recommendation logic. |
| **Design sense** | 6/10 | The results page is clean and the savings numbers are legible. But I underinvested in the landing page — the hero section is functional but not distinctive enough to get screenshotted and shared on its own merits. |
| **Problem-solving** | 8/10 | I worked through the Prisma bug systematically with hypotheses rather than random changes. I caught the incorrect AI pricing data before it shipped. I identified the API-direct vs subscription comparison edge case and solved it correctly. |
| **Entrepreneurial thinking** | 7/10 | I conducted three real user interviews, wrote defensible economics with actual numbers, and identified a specific distribution channel (engineering manager content on SEO-optimised "cost per developer" queries) rather than generic "post on Twitter" advice. Lost points for not fully thinking through the referral/viral loop mechanics. |