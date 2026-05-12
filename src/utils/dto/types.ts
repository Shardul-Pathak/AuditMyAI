import type { AiTool, PlanTier, RecommendationType, UseCase } from "../audit/types";
import type { GeneratedReportContent } from "../report/types";

export interface AuditItemDto {
  toolName: AiTool;
  currentPlan: PlanTier;
  recommendedPlan: PlanTier;
  currentMonthlyCost: number;
  recommendedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  recommendationType: RecommendationType;
  reasoning: string;
  confidenceScore: number;
}

export interface PublicAuditReportDto {
  publicId: string;
  createdAt: string;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  teamSize: number;
  primaryUseCase: UseCase;
  summary: string;
  auditScore: number;
  items: AuditItemDto[];
  adobePdfUrl?: string;
}

export interface PublicAuditReportWithContentDto
  extends PublicAuditReportDto {
  generatedContent: GeneratedReportContent;
}
