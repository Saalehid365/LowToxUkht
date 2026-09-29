import { NextResponse } from "next/server";
import { insertSubmission, type SubmissionType } from "@/lib/db";
import { offers } from "@/lib/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(v: unknown, max = 2000) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "The form could not be read. Refresh the page and try again." }, { status: 400 });
  }

  // Honeypot: real people never see or fill this field.
  if (text(body.company)) return NextResponse.json({ ok: true });

  const type: SubmissionType = body.type === "consultation" ? "consultation" : "contact";
  const name = text(body.name, 200);
  const email = text(body.email, 200);
  const phone = text(body.phone, 50) || null;
  const message = text(body.message, 5000) || null;
  const offerId = text(body.offer, 50);
  const offer = offers.find((o) => o.id === offerId)?.name ?? null;

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Enter your name.";
  if (!EMAIL.test(email)) errors.email = "Enter an email address like name@example.com.";
  if (type === "consultation" && !offer) errors.offer = "Choose a consultation.";
  if (type === "contact" && !message) errors.message = "Write a short message.";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const details: Record<string, unknown> = {};
  if (type === "consultation") {
    details.household = text(body.household, 200);
    details.priorities = Array.isArray(body.priorities) ? body.priorities.map((p) => text(p, 60)).filter(Boolean).slice(0, 12) : [];
    details.goals = text(body.goals, 2000);
  }

  try {
    await insertSubmission({ type, name, email, phone, offer, message, details });
  } catch (err) {
    console.error("Failed to save submission", err);
    return NextResponse.json(
      { error: `Your details were not sent. Try again, or email us directly.` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
