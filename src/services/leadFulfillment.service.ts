import { generateGroqReport } from "@/services/groq.service";
import { renderReportPdfBuffer } from "@/services/pdf.service";
import { sendLeadReportEmail } from "@/services/mail.service";
import { reportRepository } from "@/utils/report/generateReport";
import {
  rebuildAuditResultFromPersisted,
  type ReportWithAuditItems,
} from "@/utils/report/rebuildAuditResultFromPersisted";
import type { AuditItemDto } from "@/utils/dto/types";
import type { UseCase } from "@/utils/audit/types";

function itemsToDto(report: ReportWithAuditItems): AuditItemDto[] {
  return report.auditItems.map((i) => ({
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
}

export type LeadDeliveryResult = {
  emailSent: boolean;
  emailError?: string;
  pdfError?: string;
};

/**
 * After a lead is saved and linked: regenerate narrative with Groq, render PDF, email via Resend.
 */
export async function deliverLeadReportPdfToEmail(params: {
  publicId: string;
  toEmail: string;
  firstName: string;
  lastName: string;
  companyName: string;
}): Promise<LeadDeliveryResult> {
  const report = await reportRepository.findWithAuditItemsByPublicId(params.publicId);
  if (!report) {
    return { emailSent: false, emailError: "Report not found", pdfError: "Report not found" };
  }

  const auditResult = rebuildAuditResultFromPersisted(report);
  const input = {
    teamSize: report.teamSize,
    primaryUseCase: report.primaryUseCase as UseCase,
  };

  let pdfBuffer: Buffer;
  try {
    const generatedContent = await generateGroqReport(auditResult, input);
    pdfBuffer = await renderReportPdfBuffer({
      generatedContent,
      publicId: report.publicId,
      createdAt: report.createdAt.toISOString(),
      teamSize: report.teamSize,
      primaryUseCase: report.primaryUseCase as UseCase,
      totalMonthlySpend: Number(report.totalMonthlySpend),
      totalMonthlySavings: Number(report.totalMonthlySavings),
      totalAnnualSavings: Number(report.totalAnnualSavings),
      auditScore: report.auditScore,
      summary: report.summary,
      items: itemsToDto(report),
      leadFirstName: params.firstName,
      leadLastName: params.lastName,
      leadCompany: params.companyName,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[leadFulfillment] PDF generation failed:", err);
    return { emailSent: false, pdfError: msg, emailError: msg };
  }

  const mail = await sendLeadReportEmail({
    to: params.toEmail,
    firstName: params.firstName,
    publicId: params.publicId,
    pdfBuffer,
  });

  if (!mail.ok) {
    return { emailSent: false, emailError: mail.error, pdfError: undefined };
  }

  return { emailSent: true };
}
