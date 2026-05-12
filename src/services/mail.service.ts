import { Resend } from "resend";

function publicAppOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function fromAddress(): string {
  return process.env.RESEND_FROM?.trim() || "AuditMyAI <onboarding@resend.dev>";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type SendLeadReportEmailResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

export async function sendLeadReportEmail(params: {
  to: string;
  firstName: string;
  publicId: string;
  pdfBuffer: Buffer;
}): Promise<SendLeadReportEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[mail] RESEND_API_KEY is not set; skipping email send.");
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }

  const from = fromAddress();
  const origin = publicAppOrigin();
  const reportUrl = `${origin}/report/${encodeURIComponent(params.publicId)}`;
  const resend = new Resend(apiKey);
  const subject = "Your AI spend audit report";
  const greeting = escapeHtml(params.firstName.trim()) || "there";

  const html = `
    <p>Hi ${greeting},</p>
    <p>Thanks for requesting your audit report. Your personalized PDF is attached, and you can always view the live report here:</p>
    <p><a href="${reportUrl}">${reportUrl}</a></p>
    <p>— AuditMyAI</p>
  `;

  const { data, error } = await resend.emails.send({
    from,
    to: [params.to],
    subject,
    html,
    attachments: [
      {
        filename: `audit-report-${params.publicId}.pdf`,
        content: params.pdfBuffer.toString("base64"),
      },
    ],
  });

  if (error) {
    console.error("[mail] Resend error:", error);
    return { ok: false, error: error.message };
  }

  return { ok: true, id: data?.id };
}
