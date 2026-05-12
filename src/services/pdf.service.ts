import puppeteer from "puppeteer";
import type { GeneratedReportContent } from "@/utils/report/types";
import type { AuditItemDto } from "@/utils/dto/types";
import type { UseCase } from "@/utils/audit/types";
import { buildAuditReportPdfHtml } from "@/utils/report/pdfHtml";

export type RenderReportPdfParams = {
  generatedContent: GeneratedReportContent;
  publicId: string;
  createdAt: string;
  teamSize: number;
  primaryUseCase: UseCase;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  auditScore: number;
  summary: string;
  items: AuditItemDto[];
  leadFirstName: string;
  leadLastName: string;
  leadCompany: string;
};

export async function renderReportPdfBuffer(
  params: RenderReportPdfParams
): Promise<Buffer> {
  const html = buildAuditReportPdfHtml(params);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
