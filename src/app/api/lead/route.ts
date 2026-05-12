import { NextRequest, NextResponse } from "next/server";
import { LeadCompanySize } from "@prisma/client";
import { db } from "@/utils/db";
import { reportRepository } from "@/utils/report/generateReport";
import { checkRateLimit, extractClientIp } from "@/utils/rate-limit";
import { leadSubmitSchema, type CreateLeadDto } from "@/utils/audit/validator";
import { deliverLeadReportPdfToEmail } from "@/services/leadFulfillment.service";

/** Groq + Puppeteer + Resend can exceed default function limits on serverless hosts. */
export const maxDuration = 120;

const BUCKET_TO_ENUM: Record<CreateLeadDto["companySize"], LeadCompanySize> = {
  "1": LeadCompanySize.ONE,
  "1-10": LeadCompanySize.TWO_TO_TEN,
  "11-50": LeadCompanySize.ELEVEN_TO_FIFTY,
  "50+": LeadCompanySize.FIFTY_PLUS,
};

type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const ip = extractClientIp(req.headers);
    const limit = await checkRateLimit(ip, "/api/lead");
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: "Rate limit exceeded" } satisfies ApiResponse, {
        status: 429,
      });
    }

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" } satisfies ApiResponse, {
        status: 400,
      });
    }

    const parsed = leadSubmitSchema.safeParse(json);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((i) => i.message).join("; ");
      return NextResponse.json({ success: false, error: msg } satisfies ApiResponse, { status: 400 });
    }

    const { auditId, email, companyName, firstName, lastName, companySize } = parsed.data;
    const emailNorm = email.toLowerCase().trim();
    const companyNorm = companyName.trim();
    const firstNorm = firstName.trim();
    const lastNorm = lastName.trim();
    const displayName = `${firstNorm} ${lastNorm}`.trim();
    const companySizeEnum = BUCKET_TO_ENUM[companySize];

    const report = await db.auditReport.findUnique({
      where: { publicId: auditId },
      select: { id: true, publicId: true },
    });
    if (!report) {
      return NextResponse.json({ success: false, error: "Report not found" } satisfies ApiResponse, {
        status: 404,
      });
    }

    const lead = await db.lead.upsert({
      where: { email: emailNorm },
      create: {
        email: emailNorm,
        companyName: companyNorm,
        firstName: firstNorm,
        lastName: lastNorm,
        companySize: companySizeEnum,
        role: displayName || null,
      },
      update: {
        companyName: companyNorm,
        firstName: firstNorm,
        lastName: lastNorm,
        companySize: companySizeEnum,
        role: displayName || undefined,
      },
    });

    await reportRepository.linkLead(report.publicId, lead.id);

    const delivery = await deliverLeadReportPdfToEmail({
      publicId: auditId,
      toEmail: emailNorm,
      firstName: firstNorm,
      lastName: lastNorm,
      companyName: companyNorm,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          leadId: lead.id,
          emailSent: delivery.emailSent,
          ...(delivery.emailError ? { emailError: delivery.emailError } : {}),
          ...(delivery.pdfError ? { pdfError: delivery.pdfError } : {}),
        },
      } satisfies ApiResponse<{
        leadId: string;
        emailSent: boolean;
        emailError?: string;
        pdfError?: string;
      }>,
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/lead]", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message } satisfies ApiResponse, { status: 500 });
  }
}
