import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/utils/db";
import { generateGroqReport } from "@/services/groq.service";
import { generatedReportContentSchema } from "@/utils/report/types";
import type { AuditResult, AuditInput } from "../audit/types";
import type {
  PublicAuditReportDto,
  PublicAuditReportWithContentDto,
  AuditItemDto,
} from "../dto/types";

function toPrismaJson(value: object): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function finiteNumber(n: number, fallback = 0): number {
  return Number.isFinite(n) ? n : fallback;
}

function toDecimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(finiteNumber(n).toFixed(2));
}

function buildRecommendationsJson(auditResult: AuditResult): Prisma.InputJsonValue {
  const rows = auditResult.items.map((item) => ({
    toolName: item.toolName,
    currentPlan: item.currentPlan,
    recommendedPlan: item.recommendedPlan,
    recommendationType: item.recommendationType,
    reasoning: item.reasoning,
    monthlySavings: finiteNumber(item.monthlySavings),
    annualSavings: finiteNumber(item.annualSavings),
    currentMonthlyCost: finiteNumber(item.currentMonthlyCost),
    recommendedMonthlyCost: finiteNumber(item.recommendedMonthlyCost),
  }));
  return JSON.parse(JSON.stringify(rows)) as Prisma.InputJsonValue;
}

function isPrismaConstraintWriteError(
  error: unknown
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2011" || error.code === "P2012")
  );
}

function toAuditItemDto(item: any): AuditItemDto {
  return {
    toolName: item.toolName,
    currentPlan: item.currentPlan,
    recommendedPlan: item.recommendedPlan,
    currentMonthlyCost: Number(item.currentMonthlyCost),
    recommendedMonthlyCost: Number(item.recommendedMonthlyCost),
    monthlySavings: Number(item.monthlySavings),
    annualSavings: Number(item.annualSavings),
    recommendationType: item.recommendationType,
    reasoning: item.reasoning,
    confidenceScore: item.confidenceScore,
  };
}

function toPublicDto(
  report: Awaited<ReturnType<typeof findReportByPublicId>>,
  includeContent: boolean = false
): PublicAuditReportDto | PublicAuditReportWithContentDto | null {
  if (!report) return null;

  const baseDto: PublicAuditReportDto = {
    publicId: report.publicId,
    createdAt: report.createdAt.toISOString(),
    totalMonthlySpend: Number(report.totalMonthlySpend),
    totalMonthlySavings: Number(report.totalMonthlySavings),
    totalAnnualSavings: Number(report.totalAnnualSavings),
    teamSize: report.teamSize,
    primaryUseCase: report.primaryUseCase,
    summary: report.summary,
    auditScore: report.auditScore,
    items: report.auditItems.map(toAuditItemDto),
    ...(report.adobePdfUrl ? { adobePdfUrl: report.adobePdfUrl } : {}),
  };

  if (includeContent && report.generatedReport) {
    const validatedContent = generatedReportContentSchema.parse(
      report.generatedReport
    );
    return {
      ...baseDto,
      generatedContent: validatedContent,
    } as PublicAuditReportWithContentDto;
  }

  return baseDto;
}

type FindReportResult = Awaited<
  ReturnType<typeof db.auditReport.findUnique>
> & {
  auditItems: Awaited<
    ReturnType<typeof db.auditItem.findMany>
  >;
} | null;

async function findReportByPublicId(
  publicId: string
): Promise<FindReportResult> {
  return db.auditReport.findUnique({
    where: {
      publicId,
    },

    include: {
      auditItems: true,
    },
  }) as Promise<FindReportResult>;
}

export const reportRepository = {
  async create(
    auditResult: AuditResult,
    input: Pick<AuditInput, "teamSize" | "primaryUseCase">,
    leadId?: string
  ) {
    const generatedReport = await generateGroqReport(auditResult, input);

    // Prisma `@default(cuid())` is not always applied when using the `pg` driver adapter,
    // which surfaces as NOT NULL violations on `id` / `public_id` / nested `AuditItem.id`.
    const now = new Date();
    const reportId = randomUUID();
    const publicId = randomUUID();

    const summary =
      (typeof generatedReport.executiveSummary === "string" &&
        generatedReport.executiveSummary.trim()) ||
      auditResult.summary?.trim() ||
      "AI spend audit completed.";

    const teamSize = Math.max(
      1,
      Math.trunc(Number.isFinite(input.teamSize) ? input.teamSize : 1)
    );
    const primaryUseCase = input.primaryUseCase ?? "MIXED";

    const auditScore = Number.isFinite(auditResult.auditScore)
      ? Math.trunc(auditResult.auditScore)
      : 0;

    const reportData: Prisma.AuditReportUncheckedCreateInput = {
      id: reportId,
      auditId: publicId,
      publicId,
      createdAt: now,
      updatedAt: now,
      totalMonthlySpend: toDecimal(auditResult.totalMonthlySpend),
      totalMonthlySavings: toDecimal(auditResult.totalMonthlySavings),
      totalAnnualSavings: toDecimal(auditResult.totalAnnualSavings),
      projectedSavings: toDecimal(auditResult.totalMonthlySavings),
      teamSize,
      primaryUseCase,
      summary,
      executiveSummary: summary,
      optimizationScore: auditScore,
      auditScore,
      recommendations: buildRecommendationsJson(auditResult),
      generatedReport: toPrismaJson(generatedReport),
      leadId: leadId ?? null,
    };

    try {
      // Nested `auditItems.create` + driver adapter can omit scalar bindings; use an explicit
      // transaction + `createMany` so every NOT NULL column is written for line items.
      return await db.$transaction(async (tx) => {
        await tx.auditReport.create({ data: reportData });

        if (auditResult.items.length > 0) {
          await tx.auditItem.createMany({
            data: auditResult.items.map((item) => ({
              id: randomUUID(),
              createdAt: now,
              reportId,
              toolName: item.toolName,
              currentPlan: item.currentPlan,
              recommendedPlan: item.recommendedPlan,
              currentMonthlyCost: toDecimal(item.currentMonthlyCost),
              recommendedMonthlyCost: toDecimal(item.recommendedMonthlyCost),
              monthlySavings: toDecimal(item.monthlySavings),
              annualSavings: toDecimal(item.annualSavings),
              recommendationType: item.recommendationType,
              reasoning: item.reasoning?.trim() || "—",
              confidenceScore: finiteNumber(item.confidenceScore, 0.5),
            })),
          });
        }

        return tx.auditReport.findUniqueOrThrow({
          where: { id: reportId },
          include: { auditItems: true },
        });
      });
    } catch (error) {
      if (isPrismaConstraintWriteError(error)) {
        const meta =
          error.meta && typeof error.meta === "object"
            ? JSON.stringify(error.meta)
            : String(error.meta);
        throw new Error(`AuditReport insert failed (${error.code}): ${meta}`, {
          cause: error,
        });
      }
      throw error;
    }
  },

  async findPublic(publicId: string): Promise<PublicAuditReportDto | null> {
    const report = await findReportByPublicId(publicId);
    return toPublicDto(report, false) as PublicAuditReportDto | null;
  },

  async findPublicWithContent(
    publicId: string
  ): Promise<PublicAuditReportWithContentDto | null> {
    const report = await findReportByPublicId(publicId);
    return toPublicDto(report, true) as PublicAuditReportWithContentDto | null;
  },

  async linkLead(publicId: string, leadId: string): Promise<void> {
    await db.auditReport.update({
      where: { publicId },
      data: { leadId },
    });
  },

  async findWithAuditItemsByPublicId(publicId: string) {
    return db.auditReport.findUnique({
      where: { publicId },
      include: { auditItems: true },
    });
  },

  async findRecent(limit = 20) {
    return db.auditReport.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        publicId: true,
        createdAt: true,
        auditScore: true,
        totalMonthlySpend: true,
        totalMonthlySavings: true,
        teamSize: true,
        primaryUseCase: true,
        leadId: true,
      },
    });
  },

  async updateAdobePdfUrl(publicId: string, adobePdfUrl: string): Promise<void> {
    await db.auditReport.update({
      where: { publicId },
      data: { adobePdfUrl },
    });
  },
};