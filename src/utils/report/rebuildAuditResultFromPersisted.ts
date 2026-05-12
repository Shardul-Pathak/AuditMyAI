import type { Prisma } from "@prisma/client";
import type { AuditItemResult, AuditResult } from "@/utils/audit/types";

export type ReportWithAuditItems = Prisma.AuditReportGetPayload<{
  include: { auditItems: true };
}>;

export function rebuildAuditResultFromPersisted(
  report: ReportWithAuditItems
): AuditResult {
  const items: AuditItemResult[] = report.auditItems.map((i) => ({
    toolName: i.toolName,
    currentPlan: i.currentPlan,
    recommendedPlan: i.recommendedPlan,
    currentMonthlyCost: Number(i.currentMonthlyCost),
    recommendedMonthlyCost: Number(i.recommendedMonthlyCost),
    monthlySavings: Number(i.monthlySavings),
    annualSavings: Number(i.annualSavings),
    recommendationType: i.recommendationType,
    reasoning: i.reasoning,
    confidenceScore: i.confidenceScore,
  }));

  return {
    items,
    totalMonthlySpend: Number(report.totalMonthlySpend),
    totalMonthlySavings: Number(report.totalMonthlySavings),
    totalAnnualSavings: Number(report.totalAnnualSavings),
    auditScore: report.auditScore,
    summary: report.summary,
  };
}
