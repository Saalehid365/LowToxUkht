import { NextResponse } from "next/server";
import { insertSubmission } from "@/lib/db";
import { allIntakeFields, cleanAnswers, validateFields, answerText, intakePackage } from "@/lib/intake";
import { renderIntakePdf, intakePdfName } from "@/lib/pdf/intake-pdf";
import { sendIntakeEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "The form could not be read. Refresh the page and try again." }, { status: 400 });
  }
  if (typeof body.company === "string" && body.company) return NextResponse.json({ ok: true });

  const answers = cleanAnswers(body.answers);
  const errors = validateFields(allIntakeFields, answers);
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  // Save first, so the form is never lost even if the PDF or email step fails.
  let id: string;
  try {
    id = await insertSubmission({
      type: "intake",
      name: answerText(answers, "parentName"),
      email: answerText(answers, "email"),
      phone: answerText(answers, "phone") || null,
      offer: intakePackage.name,
      message: null,
      details: { answers },
    });
  } catch (err) {
    console.error("Failed to save intake", err);
    return NextResponse.json({ error: "Your form was not sent. Try again in a moment." }, { status: 500 });
  }

  try {
    const now = new Date();
    const pdf = await renderIntakePdf(answers, now);
    await sendIntakeEmail(answers, pdf, intakePdfName(answers, now), id);
  } catch (err) {
    console.error("Intake saved but PDF email failed", err);
  }

  return NextResponse.json({ ok: true });
}
