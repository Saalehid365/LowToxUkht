import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listClients, type ClientSummary } from "@/lib/clients";
import { listRecentEntries, type FeedItem } from "@/lib/journal-db";
import { AdminBar } from "@/components/AdminBar";
import { NightCard } from "@/components/NightCard";
import { JournalFilter } from "@/components/JournalFilter";

export const metadata: Metadata = { title: "Client Journals", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Journals({ searchParams }: { searchParams: Promise<{ client?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { client = "" } = await searchParams;
  const clientId = /^[0-9a-f-]{36}$/i.test(client) ? client : "";

  let clients: ClientSummary[] = [];
  let feed: FeedItem[] = [];
  let loadError = "";
  try {
    [clients, feed] = await Promise.all([listClients(), listRecentEntries(clientId || undefined)]);
  } catch (err) {
    console.error(err);
    loadError = "Journals could not be loaded. Check that DATABASE_URL is your Neon connection string.";
  }

  const weekAgo = Date.now() - 7 * 864e5;
  const thisWeek = feed.filter((f) => Date.parse(f.updatedAt) > weekAgo);
  const stats = [
    { label: "Nights added this week", value: thisWeek.length },
    { label: "Clients journaling this week", value: new Set(thisWeek.map((f) => f.clientId)).size },
    { label: "Slept through, this week", value: thisWeek.filter((f) => f.entry.wakings === 0).length },
    { label: "Client accounts", value: clients.length },
  ];
  const selected = clients.find((c) => c.id === clientId);

  return (
    <div className="admin">
      <AdminBar current="journals" />
      <main className="wrap admin-main">
        <h1>Client Journals</h1>
        <p className="muted admin-lede">
          Every night your clients add to their sleep journal appears here, newest first. Edited nights move back to
          the top.
        </p>
        {loadError && (
          <p className="form-error" role="alert">
            {loadError}
          </p>
        )}

        {!clientId && (
          <dl className="stats">
            {stats.map((s) => (
              <div key={s.label}>
                <dd>{s.value}</dd>
                <dt>{s.label}</dt>
              </div>
            ))}
          </dl>
        )}

        <div className="filters">
          <JournalFilter clients={clients.map((c) => ({ id: c.id, name: c.name }))} current={clientId} />
          {selected && (
            <Link href={`/admin/clients/${selected.id}`} className="link">
              Open {selected.name.split(" ")[0]}&rsquo;s full journal
            </Link>
          )}
        </div>

        {feed.length === 0 ? (
          <div className="empty">
            <p>No journal nights yet.</p>
            <p className="muted">
              When a client saves a night in her sleep journal, it appears here straight away.
            </p>
          </div>
        ) : (
          <ul className="nights">
            {feed.map((f) => (
              <NightCard
                key={`${f.clientId}-${f.night}`}
                night={f.night}
                entry={f.entry}
                client={{ id: f.clientId, name: f.name, childName: f.childName }}
                updatedAt={f.updatedAt}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
