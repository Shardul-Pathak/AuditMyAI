import { getToolPricing } from "@/utils/prices";
import { aggregateSavings, computeAuditScore, generateAuditSummary } from "@/utils/audit/score";
import { ALL_RULES } from "@/utils/audit/audit_rules";
import type {
  AuditInput,
  AuditItemResult,
  AuditResult,
  RuleContext,
  ToolSubscription,
} from "@/utils/audit/types";

function evaluateSubscription(
  subscription: ToolSubscription,
  allSubscriptions: ToolSubscription[],
  teamSize: number,
  primaryUseCase: AuditInput["primaryUseCase"]
): AuditItemResult {
  const toolPricing = getToolPricing(subscription.tool);

  const context: RuleContext = {
    subscription,
    toolPricing,
    allSubscriptions,
    teamSize,
    primaryUseCase,
  };

  const results = ALL_RULES
    .map((rule) => {
      try {
        const result = rule.evaluate(context);
        return result ? { ruleName: rule.name, result } : null;
      } catch {
        console.error(`[AuditEngine] Rule "${rule.name}" threw an error`, { tool: subscription.tool });
        return null;
      }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
  const withSavings = results.filter((r) => r.result.monthlySavings > 0);
  const best =
    withSavings.length > 0
      ? withSavings.reduce((a, b) =>
          b.result.confidenceScore > a.result.confidenceScore ? b : a
        )
      : results[0] ?? null;

  if (!best) {
    return {
      toolName: subscription.tool,
      currentPlan: subscription.plan,
      recommendedPlan: subscription.plan,
      currentMonthlyCost: subscription.monthlySpend,
      recommendedMonthlyCost: subscription.monthlySpend,
      monthlySavings: 0,
      annualSavings: 0,
      recommendationType: "OPTIMAL",
      reasoning: "No optimization opportunities identified for this subscription.",
      confidenceScore: 0.5,
    };
  }

  return {
    toolName: subscription.tool,
    ...best.result,
  };
}

export function runAudit(input: AuditInput): AuditResult {
  const { tools, teamSize, primaryUseCase } = input;
  const items: AuditItemResult[] = tools.map((subscription) =>
    evaluateSubscription(subscription, tools, teamSize, primaryUseCase)
  );
  const { totalMonthlySpend, totalMonthlySavings, totalAnnualSavings } =
    aggregateSavings(items);
  const auditScore = computeAuditScore(items, totalMonthlySpend);
  const summary = generateAuditSummary(
    items,
    totalMonthlySpend,
    totalMonthlySavings,
    auditScore
  );

  return {
    items,
    totalMonthlySpend: Math.round(totalMonthlySpend * 100) / 100,
    totalMonthlySavings: Math.round(totalMonthlySavings * 100) / 100,
    totalAnnualSavings: Math.round(totalAnnualSavings * 100) / 100,
    auditScore,
    summary,
  };
}
