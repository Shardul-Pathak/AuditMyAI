import type { AuditItemResult } from "./types";

export function computeAuditScore(
  items: AuditItemResult[],
  totalMonthlySpend: number
): number {
  if (items.length === 0) return 100;
  if (totalMonthlySpend <= 0) return 100;

  let totalDeduction = 0;
  for (const item of items) {
    if (item.recommendationType === "OPTIMAL") continue;
    const savingsPct = item.monthlySavings / totalMonthlySpend;
    let deduction = savingsPct * 100;
    if (item.recommendationType === "CONSOLIDATE") {
      deduction *= 1.5;
    }
    deduction *= item.confidenceScore;
    totalDeduction += deduction;
  }

  return Math.max(0, Math.min(100, Math.round(100 - totalDeduction)));
}

export function generateAuditSummary(
  items: AuditItemResult[],
  totalMonthlySpend: number,
  totalMonthlySavings: number,
  auditScore: number
): string {
  const savingsCount = items.filter((i) => i.monthlySavings > 0).length;
  const consolidations = items.filter((i) => i.recommendationType === "CONSOLIDATE").length;
  const downgrades = items.filter((i) => i.recommendationType === "DOWNGRADE").length;

  if (auditScore >= 90) {
    return `Your AI stack is well-optimized. We found ${savingsCount > 0 ? `minor savings of $${totalMonthlySavings.toFixed(2)}/month` : "no significant savings opportunities"} across ${items.length} tool(s).`;
  }

  const parts: string[] = [];
  if (totalMonthlySpend > 0) {
    parts.push(`You're spending $${totalMonthlySpend.toFixed(2)}/month on AI tooling.`);
  }
  if (totalMonthlySavings > 0) {
    parts.push(
      `We identified $${totalMonthlySavings.toFixed(2)}/month ($${(totalMonthlySavings * 12).toFixed(0)}/year) in savings.`
    );
  }
  if (consolidations > 0) {
    parts.push(
      `${consolidations} subscription(s) overlap with others and can be eliminated.`
    );
  }
  if (downgrades > 0) {
    parts.push(`${downgrades} tool(s) are over-provisioned for your team size.`);
  }
  if (auditScore < 40) {
    parts.push("Significant restructuring of your AI spend is recommended.");
  }
  return parts.join(" ") || "Audit complete.";
}

export function aggregateSavings(items: AuditItemResult[]): {
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
} {
  return items.reduce(
    (acc, item) => ({
      totalMonthlySpend: acc.totalMonthlySpend + item.currentMonthlyCost,
      totalMonthlySavings: acc.totalMonthlySavings + item.monthlySavings,
      totalAnnualSavings: acc.totalAnnualSavings + item.annualSavings,
    }),
    { totalMonthlySpend: 0, totalMonthlySavings: 0, totalAnnualSavings: 0 }
  );
}
