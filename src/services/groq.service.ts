import { Groq } from "groq-sdk";
import type { AuditResult, AuditInput } from "../utils/audit/types";
import type { GeneratedReportContent } from "../utils/report/types";
import { generatedReportContentSchema } from "../utils/report/types";
import { buildFallbackGeneratedReport } from "../utils/report/fallbackGeneratedReport";
import {
  ClaudeApiError,
  ClaudeParseError,
} from "../utils/errors/groq";

export type { GeneratedReportContent } from "../utils/report/types";

function getGroqClient(): Groq | null {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) return null;
  return new Groq({ apiKey: key });
}

function parseJsonResponse(rawText: string): unknown {
  let cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();

  if (!cleaned) {
    throw new ClaudeParseError("Empty response from Groq");
  }

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    cleaned = match[0];
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown parse error";
    throw new ClaudeParseError(`Failed to parse JSON response: ${message}`, {
      originalText: cleaned.substring(0, 500),
      parseError: message,
    });
  }
}

export async function generateGroqReport(
  auditResult: AuditResult,
  input: Pick<AuditInput, "teamSize" | "primaryUseCase">
): Promise<GeneratedReportContent> {
  const groq = getGroqClient();
  if (!groq) {
    console.warn(
      "[groq] GROQ_API_KEY is not set; using deterministic fallback report content."
    );
    return buildFallbackGeneratedReport(auditResult, input);
  }

  const payload = {
    companyProfile: {
      teamSize: input.teamSize,
      primaryUseCase: input.primaryUseCase,
    },

    financials: {
      totalMonthlySpend: auditResult.totalMonthlySpend,
      totalMonthlySavings: auditResult.totalMonthlySavings,
      totalAnnualSavings: auditResult.totalAnnualSavings,
      auditScore: auditResult.auditScore,
    },

    auditItems: auditResult.items.map((item) => ({
      toolName: item.toolName,
      currentPlan: item.currentPlan,
      recommendedPlan: item.recommendedPlan,
      currentMonthlyCost: item.currentMonthlyCost,
      recommendedMonthlyCost: item.recommendedMonthlyCost,
      monthlySavings: item.monthlySavings,
      annualSavings: item.annualSavings,
      recommendationType: item.recommendationType,
      reasoning: item.reasoning,
      confidenceScore: item.confidenceScore,
    })),
  };

  const prompt = `
You are a senior AI infrastructure financial analyst.

Generate ALL narrative content required for a professional 5-page AI tooling audit PDF.

The report is intended for:
- CTOs
- founders
- engineering leaders
- finance teams

The report must feel:
- executive-grade
- analytical
- financially rational
- operationally realistic

Never use:
- hype
- emojis
- exaggerated claims
- marketing tone

Return ONLY valid JSON. Do not include markdown code blocks or any text outside the JSON object.

Required JSON schema:

{
  "executiveSummary": "",
  "stackOverviewSummary": "",

  "topOpportunities": [
    {
      "title": "",
      "summary": "",
      "recommendation": "",
      "businessImpact": ""
    }
  ],

  "benchmarkInsights": {
    "spendEfficiency": "",
    "toolOverlap": "",
    "operationalRisk": ""
  },

  "implementationRoadmap": [
    {
      "phase": "",
      "objective": "",
      "expectedOutcome": ""
    }
  ],

  "finalRecommendation": "",

  "credexOpportunity": "",

  "pageInsights": [
    {
      "title": "",
      "content": ""
    }
  ],

  "implementationTimeline": [
    {
      "week": "",
      "action": "",
      "expectedSavings": ""
    }
  ],

  "summaryCards": [
    {
      "title": "",
      "value": "",
      "description": "",
      "priority": "HIGH"
    }
  ]
}

Rules:

1. executiveSummary (120-180 words)
- Mention the biggest savings opportunity first
- Explain operational inefficiencies discovered
- Explain overall stack health assessment
- Start with quantified findings

2. stackOverviewSummary (30-50 words)
- Concise overview of current tooling state
- Mention fragmentation or overprovisioning if present
- Factual tone

3. topOpportunities (3-5 items maximum)
- Issue title (short)
- What we found
- Specific recommendation
- Financial or operational impact
- Base ONLY on provided audit data

4. benchmarkInsights
- spendEfficiency: How current spend compares
- toolOverlap: Extent of redundancy
- operationalRisk: Complexity from current setup

5. implementationRoadmap (2-4 phases)
- Sequential phases
- Realistic operational actions
- Clear objectives
- Expected outcomes

6. finalRecommendation (100-150 words)
- Strategic recommendation balancing productivity and savings
- Implementation approach

7. credexOpportunity (50-100 words)
- Infrastructure credits possibilities
- API vendor optimization

8. pageInsights (3-5 items)
- Short insights for report pages

9. implementationTimeline (2-4 weeks)
- Week-by-week breakdown

10. summaryCards (3-5 items)
- High-level findings
- Priority level

CRITICAL RULES:
- Never invent numerical values not in the audit data
- Never fabricate industry benchmarks
- Keep content concise, professional, executive-grade

Audit Input:
${JSON.stringify(payload, null, 2)}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 3000,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new ClaudeApiError("Groq returned empty response");
    }

    const parsed = parseJsonResponse(content);
    return generatedReportContentSchema.parse(parsed);
  } catch (error) {
    console.warn("[groq] Report generation failed; using fallback content.", error);
    return buildFallbackGeneratedReport(auditResult, input);
  }
}
