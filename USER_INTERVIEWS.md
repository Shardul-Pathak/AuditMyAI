# USER_INTERVIEWS.md

Three interviews conducted this week with potential users. Each 10–15 minutes. Two were conducted via a 15-minute Zoom call; one was a voice note exchange on X DM.

---

## Interview 1 — A.K., CTO, 12-person Series A fintech (raised $4.2M, 8 months post-close)

**Date:** 2025-05-07  
**Format:** 15-minute Zoom call

**Background:** A.K. manages a team of 6 engineers. The team uses Cursor (3 seats), Claude Pro (2 seats), and ChatGPT Plus (2 seats). He's been approving individual tool requests as they come in but hasn't done a consolidated audit. Monthly AI spend is roughly $180/month.

**Direct quotes:**

1. "I don't actually know what we're spending in total. I know the individual items but no one has ever added it up for me."

2. "My concern isn't the $180 now — it's that if I add 4 more developers next quarter, I'm going to be approving subscriptions without any framework for what's acceptable per person."

3. "The thing I'd actually use is something that tells me: here's the right stack for your team size and use case, and here's the ceiling you should set per developer. That's the decision I'm trying to make."

**Most surprising thing:** He already knew Cursor and ChatGPT overlapped for some use cases. What he hadn't done was make a decision — he was letting both tools run because he didn't want to "take something away" from his engineers. The audit isn't just about money for him — it's about having a defensible policy.

**What it changed:** I added a "recommended per-developer budget ceiling" output to the audit results page. It wasn't in the original spec but it's exactly what A.K. described wanting. The ceiling is calculated from the recommended tool stack × the team's stated use case.

---

## Interview 2 — R.K., Engineering Manager, 28-person B2B SaaS (Series B, ~$12M ARR)

**Date:** 2025-05-10  
**Format:** 15-minute Zoom call

**Background:** R.K. manages 14 engineers. The team is on GitHub Copilot Business (14 seats, $266/month), Cursor Pro (4 seats on individual plans, $80/month), and a shared ChatGPT Team workspace ($700/year ≈ $58/month). Total ~$404/month.

**Direct quotes:**

1. "Copilot is on the company card. Cursor is on personal cards and people expense it. ChatGPT Team is on a third card. I have no idea what we're actually spending total."

2. "I Googled 'Cursor cost per developer' last week because someone asked me to justify the spend in a budget review. I couldn't find a clean answer — all the comparison posts are out of date."

3. "My CFO flagged AI as a 'growing unmanaged spend category' last quarter. I need to show her a number and a policy, not just 'it's worth it trust me.'"

**Most surprising thing:** R.K. had 4 engineers on individual Cursor Pro plans (paying personally and expensing) while the company also had GitHub Copilot Business for everyone. He hadn't noticed this was effectively paying for two overlapping coding assistants for 4 people.

**What it changed:** This confirmed the overlap detection feature is the most important single output for EM-stage users. It also reframed the SEO content strategy — R.K. specifically said he Googled "Cursor cost per developer" — which became the target keyword for the GTM content piece.

---

## Interview 3 — S.P., Founder (solo), pre-seed developer tools startup

**Date:** 2025-05-09  
**Format:** Voice note exchange via X DM (~12 minutes total audio)

**Background:** S.P. is building alone. He uses Claude Pro ($20/month), Cursor Pro ($20/month), and occasionally GPT-4 via API directly (roughly $30/month in API spend). Total ~$70/month.

**Direct quotes:**

1. "I'm paying for Claude Pro and I honestly don't use it that much anymore since I started using Cursor more. I just haven't got around to cancelling it."

2. "I don't know if $70 is high or low for someone building alone. I have no reference point."

3. "I'd pay attention to a tool that just tells me honestly: here are the two things you should cancel and here's what you'd save. I don't want analysis — I want a decision."

**Most surprising thing:** He'd already mentally identified Claude Pro as probably unnecessary but hadn't cancelled it. The friction wasn't ignorance — it was the absence of a clean moment to act. He said: "If something showed me '$20/month, cancel this' with a cancel button, I'd do it immediately." This is the case for not just showing savings but surfacing the specific cancellation action.

**What it changed:** Added a "cancel" or "downgrade" CTA link to each tool recommendation card that links directly to the vendor's account/billing page. For Claude, it links to claude.ai/settings. For Cursor, to cursor.com/settings. This took 30 minutes to implement and is the highest-leverage UX improvement from all three interviews.