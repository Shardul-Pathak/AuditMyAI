import type { AuditResult, AuditInput } from "@/utils/audit/types";
import type { GeneratedReportContent } from "@/utils/report/types";
import { generatedReportContentSchema } from "@/utils/report/types";

function money(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  return v.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function clamp(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, Math.max(0, max - 1))}…`;
}

/**
 * Deterministic narrative used when Groq is unavailable or returns invalid JSON.
 * Only cites numbers from the provided audit result.
 */
export function buildFallbackGeneratedReport(
  auditResult: AuditResult,
  input: Pick<AuditInput, "teamSize" | "primaryUseCase">
): GeneratedReportContent {
  const spend = money(auditResult.totalMonthlySpend);
  const saveMo = money(auditResult.totalMonthlySavings);
  const saveYr = money(auditResult.totalAnnualSavings);
  const score = Number.isFinite(auditResult.auditScore)
    ? Math.trunc(auditResult.auditScore)
    : 0;
  const toolLines = clamp(
    auditResult.items
      .map(
        (i) =>
          `${i.toolName} (${i.currentPlan}): about $${money(i.currentMonthlyCost)}/mo, ${i.recommendationType}, savings about $${money(i.monthlySavings)}/mo.`
      )
      .join(" "),
    1200
  );

  const executiveSummary = clamp(
    `Estimated current AI tooling spend is about $${spend}/month across ${auditResult.items.length} audited line item(s). ` +
      `Modeled monthly savings are about $${saveMo}/month (about $${saveYr}/year) with optimization score ${score}/100. ` +
      `Per-tool findings: ${toolLines || "No line items were returned."} ` +
      `Team size ${input.teamSize}; primary use case ${input.primaryUseCase}. ` +
      `Auto-generated narrative (LLM unavailable); figures are from the audit engine only.`,
    2000
  );

  const stackOverviewSummary = clamp(
    `Stack overview: ${auditResult.items.length} subscription(s), about $${spend}/month modeled spend, ` +
      `use case ${input.primaryUseCase}, team size ${input.teamSize}. ` +
      `Aggregate modeled savings about $${saveMo}/month.`,
    1000
  );

  const topFromItems = auditResult.items
    .filter((i) => i.monthlySavings > 0)
    .slice(0, 5)
    .map((i) => ({
      title: clamp(`${i.toolName}: ${i.recommendationType}`, 200),
      summary: clamp(
        `Current about $${money(i.currentMonthlyCost)}/mo vs modeled target about $${money(i.recommendedMonthlyCost)}/mo.`,
        1000
      ),
      recommendation: clamp(i.reasoning, 1000),
      businessImpact: clamp(
        `Estimated monthly savings about $${money(i.monthlySavings)}/mo (about $${money(i.annualSavings)}/yr).`,
        500
      ),
    }));

  const topOpportunities =
    topFromItems.length > 0
      ? topFromItems
      : [
          {
            title: "Review modeled savings",
            summary: clamp(
              `The audit estimates about $${saveMo}/month in potential savings vs about $${spend}/month modeled spend.`,
              1000
            ),
            recommendation: clamp(
              "Validate seat counts, invoices, and renewal terms, then prioritize the largest monthly deltas first.",
              1000
            ),
            businessImpact: clamp(
              `Annualized modeled savings about $${saveYr}/year at current inputs.`,
              500
            ),
          },
        ];

  const pct =
    auditResult.totalMonthlySpend > 0
      ? ((auditResult.totalMonthlySavings / auditResult.totalMonthlySpend) * 100).toFixed(0)
      : "0";

  const raw: GeneratedReportContent = {
    executiveSummary,
    stackOverviewSummary,
    topOpportunities,
    benchmarkInsights: {
      spendEfficiency: clamp(
        `Modeled monthly spend is about $${spend}; modeled monthly savings are about $${saveMo} (${pct}% of spend).`,
        500
      ),
      toolOverlap: clamp(
        `Evaluated ${auditResult.items.length} tool/plan row(s) for overlap signals; use case ${input.primaryUseCase}.`,
        500
      ),
      operationalRisk: clamp(
        `Optimization score ${score}/100 at declared inputs; risk rises with redundant paid seats.`,
        500
      ),
    },
    implementationRoadmap: [
      {
        phase: clamp("Week 1: validate billing reality", 200),
        objective: clamp(
          "Confirm invoices, renewal dates, and seat assignments for each audited tool.",
          500
        ),
        expectedOutcome: clamp(
          "A ranked list of safe changes ordered by modeled monthly impact.",
          500
        ),
      },
      {
        phase: clamp("Weeks 2–4: execute plan changes", 200),
        objective: clamp(
          "Implement downgrades, consolidations, or seat corrections where policy allows.",
          500
        ),
        expectedOutcome: clamp(
          `Progress toward modeled $${saveMo}/month savings where contracts permit.`,
          500
        ),
      },
    ],
    finalRecommendation: clamp(
      `With about $${spend}/month modeled spend and about $${saveMo}/month modeled savings, start with the highest-confidence line items, ` +
        `then re-audit after changes. Keep team size (${input.teamSize}) aligned with seats to avoid recurring waste.`,
      1000
    ),
    credexOpportunity: clamp(
      `If you use committed spend or credits, map invoices to cost centers and compare API vs seat pricing to usage. ` +
        `Modeled annual savings about $${saveYr}/year.`,
      1000
    ),
    pageInsights: [
      {
        title: clamp("Spend snapshot", 200),
        content: clamp(
          `Modeled monthly spend about $${spend}; modeled monthly savings about $${saveMo}; score ${score}/100.`,
          1000
        ),
      },
      {
        title: clamp("Next steps", 200),
        content: clamp(
          "Validate top deltas with finance and schedule vendor changes outside critical release windows.",
          1000
        ),
      },
      {
        title: clamp("Disclaimer", 200),
        content: clamp(
          "Figures are modeled from your inputs and internal pricing rules; not a guarantee of vendor outcomes.",
          1000
        ),
      },
    ],
    implementationTimeline: [
      {
        week: clamp("Week 1", 100),
        action: clamp("Validate invoices, seats, and renewal terms for each audited tool.", 500),
        expectedSavings: clamp("Clarify realistic vs contract-blocked savings.", 200),
      },
      {
        week: clamp("Week 2", 100),
        action: clamp("Execute the lowest-risk top changes first.", 500),
        expectedSavings: clamp(`Partial progress toward $${saveMo}/month modeled savings.`, 200),
      },
    ],
    summaryCards: [
      {
        title: clamp("Monthly spend (modeled)", 200),
        value: clamp(`$${spend}`, 100),
        description: clamp("Declared monthly spend summed across audited tools.", 300),
        priority: "HIGH",
      },
      {
        title: clamp("Modeled monthly savings", 200),
        value: clamp(`$${saveMo}`, 100),
        description: clamp("Aggregate modeled savings from the rules engine.", 300),
        priority: "HIGH",
      },
      {
        title: clamp("Optimization score", 200),
        value: clamp(`${score}/100`, 100),
        description: clamp("Higher means less modeled waste at provided inputs.", 300),
        priority: "MEDIUM",
      },
    ],
  };

  return generatedReportContentSchema.parse(raw);
}
