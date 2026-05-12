import { auditInputSchema } from "@/utils/audit/validator";
import { runAudit } from "@/controllers/audit.controller";
import { reportRepository } from "@/utils/report/generateReport";
import type { PublicAuditReportDto } from "@/utils/dto/types";
import type { AuditInputDto } from "@/utils/audit/validator";

export type CreateReportResult =
  | { success: true; publicId: string; report: PublicAuditReportDto }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export type GetReportResult =
  | { success: true; report: PublicAuditReportDto }
  | { success: false; error: string };

export const reportService = {
  async createReport(
    rawInput: unknown,
    options: { leadId?: string } = {}
  ): Promise<CreateReportResult> {
    const parsed = auditInputSchema.safeParse(rawInput);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      return { success: false, error: "Validation failed", fieldErrors };
    }

    const input: AuditInputDto = parsed.data;
    const auditResult = runAudit(input);

    let saved;
    try {
      saved = await reportRepository.create(auditResult, input, options.leadId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save audit report";
      console.error("[reportService.createReport] persist failed:", error);
      return { success: false, error: message };
    }

    const publicReport = await reportRepository.findPublic(saved.publicId);
    if (!publicReport) {
      return { success: false, error: "Failed to retrieve saved report" };
    }

    return { success: true, publicId: saved.publicId, report: publicReport };
  },

  async getPublicReport(publicId: string): Promise<GetReportResult> {
    if (!publicId || typeof publicId !== "string") {
      return { success: false, error: "Invalid report ID" };
    }

    const report = await reportRepository.findPublic(publicId);
    if (!report) {
      return { success: false, error: "Report not found" };
    }

    return { success: true, report };
  },
};
