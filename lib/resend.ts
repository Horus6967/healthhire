import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail({
  managerEmail,
  managerName,
  candidateName,
  jobTitle,
  company,
  token,
}: {
  managerEmail: string;
  managerName: string;
  candidateName: string;
  jobTitle: string;
  company: string;
  token: string;
}) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  return resend.emails.send({
    from: "HealthHire <verify@healthhire.careers>",
    to: managerEmail,
    subject: `Can you verify ${candidateName}'s work history at ${company}?`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0f172a;">Work History Verification Request</h2>
        <p>Hi ${managerName},</p>
        <p>
          <strong>${candidateName}</strong> listed you as their manager at <strong>${company}</strong>
          for the role of <strong>${jobTitle}</strong> on HealthHire, a verified healthcare job platform.
        </p>
        <p>We'd like to confirm this work history is accurate. This takes one click — no account required.</p>
        <div style="margin: 32px 0;">
          <a href="${verifyUrl}" style="background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            ✓ Yes, I can confirm this
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          If you don't recognize ${candidateName} or this information is incorrect, simply ignore this email — no action needed.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">HealthHire — Verified Healthcare Careers</p>
      </div>
    `,
  });
}
