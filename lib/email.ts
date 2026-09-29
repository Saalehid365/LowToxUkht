import "server-only";
import { answerText, type IntakeAnswers } from "@/lib/intake";
import { site } from "@/lib/site";

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.INTAKE_EMAIL_TO);

const esc = (s: string) => s.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]!);

// Sends the intake PDF to the coach through Resend's HTTP API.
export async function sendIntakeEmail(answers: IntakeAnswers, pdf: Buffer, filename: string, submissionId: string) {
  if (!emailConfigured()) {
    console.warn("Intake email not sent: set RESEND_API_KEY and INTAKE_EMAIL_TO.");
    return false;
  }

  const parent = answerText(answers, "parentName");
  const child = answerText(answers, "childName");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const rows: [string, string][] = [
    ["Parent or guardian", parent],
    ["Child", [child, answerText(answers, "childAge") && `age ${answerText(answers, "childAge")}`].filter(Boolean).join(", ")],
    ["Phone / WhatsApp", answerText(answers, "phone")],
    ["Email", answerText(answers, "email")],
    ["Allergies", answerText(answers, "allergies")],
    ["Medications", answerText(answers, "medications")],
    ["Focus areas", answerText(answers, "focusAreas")],
    ["Biggest difference", answerText(answers, "biggestDifference")],
  ].filter((r): r is [string, string] => Boolean(r[1]));

  const html = `
  <div style="font-family:Georgia,serif;color:#123c34;max-width:560px">
    <p style="font-style:italic;color:#a8731f;margin:0 0 12px">${esc(site.name)}</p>
    <h1 style="font-weight:400;font-size:26px;margin:0 0 16px">New intake form: ${esc(child || parent)}</h1>
    <table style="font-family:Helvetica,Arial,sans-serif;font-size:14px;border-collapse:collapse;width:100%">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:8px 12px 8px 0;border-top:1px solid #d3ddd6;color:#5e6a63;vertical-align:top;width:40%">${esc(k)}</td><td style="padding:8px 0;border-top:1px solid #d3ddd6">${esc(v)}</td></tr>`,
        )
        .join("")}
    </table>
    <p style="font-family:Helvetica,Arial,sans-serif;font-size:14px;margin-top:20px">The full form is attached as a PDF.${
      siteUrl ? ` You can also find it in your <a href="${siteUrl}/admin" style="color:#123c34">dashboard</a>.` : ""
    }</p>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.INTAKE_EMAIL_FROM || "Intake forms <onboarding@resend.dev>",
      to: process.env.INTAKE_EMAIL_TO!.split(",").map((e) => e.trim()),
      reply_to: answerText(answers, "email") || undefined,
      subject: `New intake form: ${child || "child"} (${parent})`,
      html,
      attachments: [{ filename, content: pdf.toString("base64") }],
      headers: { "X-Entity-Ref-ID": submissionId },
    }),
  });
  if (!res.ok) {
    console.error("Resend rejected the intake email", res.status, await res.text());
    return false;
  }
  return true;
}
