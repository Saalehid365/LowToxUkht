import "server-only";
import { db } from "@/lib/db";
import { cleanEntry, type Entries } from "@/lib/journal";

export async function getEntries(clientId: string): Promise<Entries> {
  const sql = await db();
  const rows = await sql`SELECT night::text AS night, data FROM sleep_entries WHERE client_id = ${clientId} ORDER BY night`;
  return Object.fromEntries(rows.map((r) => [r.night as string, cleanEntry(r.data)]));
}

export async function saveEntry(clientId: string, night: string, data: unknown) {
  const sql = await db();
  const entry = cleanEntry(data);
  await sql`
    INSERT INTO sleep_entries (client_id, night, data) VALUES (${clientId}, ${night}, ${JSON.stringify(entry)}::jsonb)
    ON CONFLICT (client_id, night) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
  return entry;
}

export async function deleteAllEntries(clientId: string) {
  const sql = await db();
  await sql`DELETE FROM sleep_entries WHERE client_id = ${clientId}`;
}

export type FeedItem = { clientId: string; name: string; childName: string; night: string; entry: ReturnType<typeof cleanEntry>; updatedAt: string };

// Latest journal nights across all clients, most recently added or edited first.
export async function listRecentEntries(clientId?: string, limit = 200): Promise<FeedItem[]> {
  const sql = await db();
  const rows = clientId
    ? await sql`
        SELECT e.client_id, c.name, c.child_name, e.night::text AS night, e.data, e.updated_at
        FROM sleep_entries e JOIN clients c ON c.id = e.client_id
        WHERE e.client_id = ${clientId}
        ORDER BY e.updated_at DESC LIMIT ${limit}`
    : await sql`
        SELECT e.client_id, c.name, c.child_name, e.night::text AS night, e.data, e.updated_at
        FROM sleep_entries e JOIN clients c ON c.id = e.client_id
        ORDER BY e.updated_at DESC LIMIT ${limit}`;
  return rows.map((r) => ({
    clientId: r.client_id as string,
    name: r.name as string,
    childName: (r.child_name as string) ?? "",
    night: r.night as string,
    entry: cleanEntry(r.data),
    updatedAt: new Date(r.updated_at as string).toISOString(),
  }));
}
