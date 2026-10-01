import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin, passwordEnabled } from "@/lib/auth";
import { AdminBar } from "@/components/AdminBar";
import { listSubmissions, usingNeon } from "@/lib/db";
import { SubmissionsTable } from "@/components/SubmissionsTable";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Admin() {
  if (!(await isAdmin())) redirect("/admin/login");

  let rows: Awaited<ReturnType<typeof listSubmissions>> = [];
  let loadError = "";
  try {
    rows = await listSubmissions();
  } catch (err) {
    console.error(err);
    loadError = "Submissions could not be loaded. Check that DATABASE_URL is your Neon connection string.";
  }

  const weekAgo = Date.now() - 7 * 864e5;
  const stats = [
    { label: "New, not yet handled", value: rows.filter((r) => r.status === "new").length },
    { label: "Received this week", value: rows.filter((r) => Date.parse(r.created_at) > weekAgo).length },
    { label: "Intake forms", value: rows.filter((r) => r.type === "intake").length },
    { label: "Booked", value: rows.filter((r) => r.status === "booked").length },
  ];

  return (
    <div className="admin">
      <AdminBar current="submissions" />

      <main className="wrap admin-main">
        <h1>Submissions</h1>
        {!passwordEnabled() && (
          <p className="notice">
            No password is set, so anyone with this page&rsquo;s link can see these submissions. Add{" "}
            <code>ADMIN_PASSWORD</code> before the site goes live.
          </p>
        )}
        {!usingNeon && (
          <p className="notice">
            Test mode: submissions are saved to a local file. Add your Neon <code>DATABASE_URL</code> to store them in
            your database.
          </p>
        )}
        {loadError && (
          <p className="form-error" role="alert">
            {loadError}
          </p>
        )}

        <dl className="stats">
          {stats.map((s) => (
            <div key={s.label}>
              <dd>{s.value}</dd>
              <dt>{s.label}</dt>
            </div>
          ))}
        </dl>

        <SubmissionsTable rows={rows} />
      </main>
    </div>
  );
}
