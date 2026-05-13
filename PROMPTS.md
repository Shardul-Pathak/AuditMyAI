# PROMPTS.md

This document contains the LLM prompts used in AuditMyAI, the reasoning behind them, and what was tried and discarded.

---

## Primary Prompt: AI Audit Summary

**Used in:** `/api/summary` route  
**Model:** `llama-3-70b-8192` (Groq)  
**Fallback on error:** Template string (see below)

### System Prompt

```
You are a concise, direct financial advisor specialising in AI tool cost optimisation for startups and engineering teams.

You never make up savings numbers or tool recommendations — all data is provided to you. Your job is to synthesise the provided audit data into a clear, readable, 80–100 word paragraph that feels like it was written for this specific team, not a generic report.

Tone: plain, confident, slightly informal. No bullet points. No headers. Write as if you're a smart colleague who just reviewed their bills, not a chatbot.
```

### User Prompt Template

```
Here is the AI spend audit for {{teamSize}} people at {{companyName}}, primary use case: {{useCase}}.

Current monthly AI spend: ${{currentMonthlySpend}}
Recommended monthly spend: ${{optimisedMonthlySpend}}
Total potential monthly savings: ${{totalMonthlySavings}}
Total potential annual savings: ${{totalAnnualSavings}}

Per-tool findings:
{{perToolSummary}}

Write an 80-100 word summary paragraph that:
1. Acknowledges their current situation specifically (reference the tools and use case)
2. States the headline savings opportunity clearly
3. Names the 1-2 highest-impact changes they should make first
4. Ends with a forward-looking sentence about what their optimised stack looks like

Do not use bullet points. Do not use headers. Write as a single paragraph.
```

Where `{{perToolSummary}}` is a newline-separated list of strings in the format:
```
- Cursor Pro (1 seat, $20/mo): No change needed — correctly sized for 1 developer.
- ChatGPT Plus (3 seats, $60/mo): Consider ChatGPT Business at $20/user — saves data privacy + admin for the same price.
- Claude Pro (2 seats, $40/mo): 2 seats on individual Pro plans — Team plan at $25/user saves $30/mo with better collaboration features.
```

---

## Why This Prompt Was Written This Way

**System prompt rationale:**

The biggest failure mode for AI-generated financial summaries is hallucination — confidently stating incorrect savings numbers. The system prompt explicitly tells the model its job is synthesis, not calculation. All numbers are pre-computed by the deterministic audit engine and passed in. This separates the "math" from the "writing."

The tone instruction ("smart colleague, not a chatbot") was added after testing. Without it, the model defaulted to corporate-speak ("We have identified several opportunities to optimise your AI infrastructure expenditure"). The final version is noticeably more readable.

**User prompt rationale:**

Providing the per-tool findings as a pre-formatted list (rather than the raw JSON) reduced hallucination significantly. When passed raw JSON, the model sometimes inverted savings (reported a saving as a cost increase) on 2 out of 10 test runs. With the pre-formatted list, this dropped to 0 out of 20 test runs.

The four-part instruction at the end ("acknowledge current situation / state headline savings / name 1-2 changes / end forward-looking") was the result of A/B testing two approaches:
- **Version A:** No structural instruction — the model wrote readable paragraphs but often buried the savings number mid-paragraph or omitted the specific action items.
- **Version B (current):** Explicit four-part structure — the model consistently led with the team context, stated savings clearly, and gave actionable recommendations.

Version B was chosen. The structure doesn't make the output feel formulaic because the content is different for every audit.

---

## Template Fallback (Used When Both APIs Fail)

When the Groq API returns an error (typically 429 rate limits or 5xx), the UI shows this template instead of an empty state or an error message:

```
Your team is currently spending ${{currentMonthlySpend}}/month on AI tools.
Based on your stack — {{toolList}} — we identified ${{totalMonthlySavings}}/month
(${{totalAnnualSavings}}/year) in potential savings. The highest-impact change is
{{topRecommendation}}. With these adjustments, your optimised AI spend would be
${{optimisedMonthlySpend}}/month.
```

This is intentionally kept short and factual. It's not as readable as the LLM-generated version, but it's never empty and it's always accurate (all values are pre-computed).

---

## What Was Tried and Didn't Work

**Attempt 1: Asking the model to both calculate and narrate.**  
First prototype passed the raw tool/plan/spend list to the model and asked it to "calculate savings and write a summary." Savings numbers were wrong ~30% of the time. Abandoned after 10 test runs.

**Attempt 2: Asking for a bullet-point summary, then formatting it.**  
The model produced good bullets but converting them to a paragraph in a second API call added 800–1,200 ms of latency. Users noticed the delay in the skeleton state. Abandoned in favour of asking directly for a single paragraph.

**Attempt 3: Using `max_tokens: 200` without length instruction.**  
The model occasionally produced summaries of 40–50 words that felt incomplete. Adding "80–100 word summary paragraph" to the user prompt resolved this. `max_tokens` is still set to 200 as a hard cap to prevent runaway output.

**Attempt 4: Including a disclaimer ("Note: these recommendations are not financial advice").**  
Added to the system prompt on Day 3. Removed on Day 4 after testing with two potential users who found it undermined confidence in the tool. The audit results page already includes a small legal disclaimer in the footer — duplicating it in the AI summary was redundant and diluted the tone.