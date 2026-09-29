import { isAdmin } from "@/lib/auth";
import { getSubmission } from "@/lib/db";
import { cleanAnswers } from "@/lib/intake";
import { renderIntakePdf, intakePdfName } from "@/lib/pdf/intake-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return new Response("Sign in at /admin first.", { status: 401 });
  const { id } = await params;
  const row = await getSubmission(id);
  if (!row || row.type !== "intake") return new Response("This intake form no longer exists.", { status: 404 });

  const answers = cleanAnswers((row.details as { answers?: unknown }).answers);
  const at = new Date(row.created_at);
  const pdf = await renderIntakePdf(answers, at);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${intakePdfName(answers, at)}"`,
    },
  });
}
