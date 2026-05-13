import { Resend } from "resend";

function publicAppOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://audit-my-ai.vercel.app";
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
  const firstName = escapeHtml(params.firstName.trim()) || "there";

  const html = `
    <div style="margin:0;padding:0;background:#f8fafc;">
      <div style="max-width:640px;margin:0 auto;padding:32px 16px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,42,0.08);">
          <div style="padding:28px 28px 20px;background:linear-gradient(135deg,#0f172a 0%,#1e293b 55%,#334155 100%);color:#f8fafc;">
            <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.8;">AuditMyAI</div>
            <h1 style="margin:10px 0 0;font-size:26px;line-height:1.2;">Your audit report is ready</h1>
          </div>

          <div style="padding:28px;">
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hi ${firstName},</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">
              Thank you for requesting an AI spend audit. We’ve attached your personalized PDF report, and you can
              also access the live report anytime using the secure link below.
            </p>

            <div style="margin:24px 0;padding:20px;border:1px solid #dbe4f0;border-radius:16px;background:#f8fafc;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#475569;">
                View your report
              </p>
              <a href="${reportUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;font-size:14px;font-weight:700;">
                Open live report
              </a>
              <p style="margin:14px 0 0;font-size:13px;line-height:1.6;color:#64748b;word-break:break-all;">
                ${reportUrl}
              </p>
            </div>

            <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
                If you’d like help interpreting the findings or turning the recommendations into an action plan, reply to this email and we’ll be glad to help.
              </p>
              <p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:#475569;">
                Best regards,<br />
                <strong style="color:#0f172a;">The AuditMyAI Team</strong>
              </p>
            </div>
          </div>

          <div style="padding:18px 28px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#64748b;">
              Powered by Credex · <a href="https://credex.rocks" style="color:#0f172a;text-decoration:underline;">credex.rocks</a>
            </p>
          </div>
        </div>
      </div>
    </div>
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
