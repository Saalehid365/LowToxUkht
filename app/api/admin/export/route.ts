import { isAdmin } from "@/lib/auth";
import { listSubmissions } from "@/lib/db";

export const dynamic = "force-dynamic";

function cell(v: unknown) {
  let s = v == null ? "" : Array.isArray(v) ? v.join("; ") : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) return new Response("Sign in at /admin first.", { status: 401 });

  const rows = await listSubmissions();
  const header = ["Received", "Type", "Status", "Name", "Email", "Phone", "Consultation", "Household", "Focus", "Notes / message"];
  const lines = rows.map((r) => {
    const d = r.details as { household?: string; priorities?: string[]; goals?: string };
    return [r.created_at, r.type, r.status, r.name, r.email, r.phone, r.offer, d.household, d.priorities, d.goals || r.message]
      .map(cell)
      .join(",");
  });

  return new Response([header.map(cell).join(","), ...lines].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="submissions-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
