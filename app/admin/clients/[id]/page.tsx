import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getClient } from "@/lib/clients";
import { getEntries } from "@/lib/journal-db";
import { NightCard } from "@/components/NightCard";
import { AdminBar } from "@/components/AdminBar";

export const metadata: Metadata = { title: "Sleep journal", robots: { index: false } };
export const dynamic = "force-dynamic";

const avg = (a: number[]) => (a.length ? Math.round((a.reduce((t, x) => t + x, 0) / a.length) * 10) / 10 : null);

export default async function ClientJournal({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const client = await getClient(id);
  if (!client) notFound();

  const entries = await getEntries(id);
  const nights = Object.keys(entries).sort().reverse();
  const recent = nights.slice(0, 7).map((k) => entries[k]);
  const stats = [
    { label: "Nights logged", value: nights.length },
    { label: "Slept through, last 7 logged", value: recent.filter((e) => e.wakings === 0).length },
    { label: "Average wakings, last 7 logged", value: avg(recent.map((e) => e.wakings)) ?? "–" },
    { label: "Mum's sleep, last 7 logged", value: avg(recent.filter((e) => e.mumSleep).map((e) => e.mumSleep)) ?? "–" },
  ];

  return (
    <div className="admin">
      <AdminBar current="clients" />
      <main className="wrap admin-main">
        <p className="small">
          <Link href="/admin/clients">‹ All clients</Link>
        </p>
        <h1>{client.name}</h1>
        <p className="muted admin-lede">
          Sleep journal{client.child_name ? ` for ${client.child_name}` : ""}. <a href={`mailto:${client.email}`}>{client.email}</a>
          {client.phone ? ` · ${client.phone}` : ""}
        </p>

        <dl className="stats">
          {stats.map((s) => (
            <div key={s.label}>
              <dd>{s.value}</dd>
              <dt>{s.label}</dt>
            </div>
          ))}
        </dl>

        {nights.length === 0 ? (
          <div className="empty">
            <p>No nights in the journal yet.</p>
          </div>
        ) : (
          <ul className="nights">
            {nights.map((k) => (
              <NightCard key={k} night={k} entry={entries[k]} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
