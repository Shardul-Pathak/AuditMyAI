# METRICS.md

---

## North Star Metric

**Qualified leads generated per week** — defined as a unique email address captured from an audit that showed ≥$200/month in potential savings.

**Why this, not "audits completed" or "DAU":**  
AuditMyAI is a B2B lead-generation tool for Credex. The business outcome is Credex credit purchases. The closest measurable proxy to a credit purchase is a qualified lead — a real person, at a real company, with a real savings opportunity, who has chosen to share their contact details. DAU is the wrong metric because most users will run one audit per quarter (or less) — a tool used well once is better than a tool used carelessly every day.

Audits completed is too easy to game (low-intent bots, test runs) and doesn't indicate purchase intent. Email capture does.

---

## 3 Input Metrics That Drive the North Star

| Input Metric | Why It Matters |
|-------------|---------------|
| **1. Audit completion rate** (audits started → audits completed) | If users drop off mid-form, the North Star can never be hit. Target: ≥50%. Low completion rate is a form UX signal. |
| **2. High-savings rate** (% of completed audits showing ≥$200/mo savings) | If most audits show $0–$50 in savings, the email gate won't convert — users don't see enough value to share contact details. Target: ≥35% of audits show ≥$200 savings. This also validates the hypothesis that the addressable market actually overspends. |
| **3. Email capture rate among high-savings users** (% of ≥$200 audits that result in email submission) | The moment of decision: did they see enough value to raise their hand? Target: ≥40%. Low rate here means the results page isn't communicating value clearly enough, or the email gate feels too intrusive. |

---

## What We'd Instrument First

In order of priority:

1. **Funnel events** — `audit_started`, `audit_completed`, `results_viewed`, `email_modal_opened`, `email_submitted`, `share_url_copied`. These are the minimum viable analytics to diagnose where users drop off.

2. **Per-audit savings distribution** — histogram of `totalMonthlySavings` across all completed audits. If the median is $0–$50, the audit engine's recommendations are too conservative or the user base is already well-optimised.

3. **Referral source vs conversion rate** — did users who arrived from HN convert to email leads at a different rate than Product Hunt users? If HN converts 3× better, double down on technical content.

4. **Shareable URL click-through rate** — how many share tokens are generated vs how many result in a new visitor. This measures whether the viral loop is working.

5. **Credex consultation booking rate from email leads** — the hand-off metric. What % of captured leads actually book a Credex consultation? If this is <5%, the "high-savings" email template needs work.

---

## What Number Triggers a Pivot Decision

**Audit completion rate below 25% after 500 audit starts.** This would mean the form is too long or confusing and people aren't getting to results. The pivot would be to shorten the form dramatically — strip back to 3 fields (main tool, team size, monthly budget) and show a rough estimate without full per-tool breakdown.

**Email capture rate below 10% of completed audits after 200 completions.** This would mean users are getting the value (they completed the audit) but not seeing enough reason to share their email. The pivot would be to move the email gate earlier — show a partial result, gate the full breakdown — or change the offer (e.g. "email me when my stack changes" instead of "capture the report").

**High-savings rate below 15%** (fewer than 1 in 7 users has ≥$200/month in savings). This would call into question whether the target user — the over-spending EM or founder — is actually using the tool, or whether we're attracting already-optimised users. Pivot: tighten the landing page copy to pre-qualify visitors ("for teams spending $500+ per month on AI tools").