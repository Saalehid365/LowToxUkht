import "server-only";
import { neon } from "@neondatabase/serverless";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type SubmissionType = "consultation" | "contact" | "intake";
export type SubmissionStatus = "new" | "contacted" | "booked" | "closed";
export const STATUSES: SubmissionStatus[] = ["new", "contacted", "booked", "closed"];

export type Submission = {
  id: string;
  created_at: string;
  type: SubmissionType;
  name: string;
  email: string;
  phone: string | null;
  offer: string | null;
  message: string | null;
  details: Record<string, unknown>;
  status: SubmissionStatus;
};

export type NewSubmission = Omit<Submission, "id" | "created_at" | "status">;

const url = process.env.DATABASE_URL;
const sql = url ? neon(url) : null;

export const usingNeon = Boolean(sql);

// Tables are created on first use, so there is no separate migration step.
let schemaReady: Promise<unknown> | null = null;
function ensureSchema() {
  if (!sql) return Promise.resolve();
  const q = sql;
  schemaReady ??= (async () => {
    await q`
      CREATE TABLE IF NOT EXISTS submissions (
        id uuid PRIMARY KEY,
        created_at timestamptz NOT NULL DEFAULT now(),
        type text NOT NULL,
        name text NOT NULL,
        email text NOT NULL,
        phone text,
        offer text,
        message text,
        details jsonb NOT NULL DEFAULT '{}'::jsonb,
        status text NOT NULL DEFAULT 'new'
      )`;
    await q`
      CREATE TABLE IF NOT EXISTS clients (
        id uuid PRIMARY KEY,
        created_at timestamptz NOT NULL DEFAULT now(),
        name text NOT NULL,
        email text NOT NULL UNIQUE,
        phone text,
        password_hash text NOT NULL,
        failed_logins int NOT NULL DEFAULT 0,
        locked_until timestamptz,
        reset_token_hash text,
        reset_expires_at timestamptz,
        child_name text NOT NULL DEFAULT ''
      )`;
    await q`
      CREATE TABLE IF NOT EXISTS client_sessions (
        token_hash text PRIMARY KEY,
        client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        expires_at timestamptz NOT NULL
      )`;
    await q`
      CREATE TABLE IF NOT EXISTS sleep_entries (
        client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        night date NOT NULL,
        data jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (client_id, night)
      )`;
  })().catch((err) => {
    schemaReady = null;
    throw err;
  });
  return schemaReady;
}

// Client accounts and journals need the database; there is no local file fallback for them.
export async function db() {
  if (!sql) throw new Error("Client accounts need DATABASE_URL to be set.");
  await ensureSchema();
  return sql;
}

// Local fallback so the site works before a Neon database is connected.
const localFile = path.join(process.cwd(), ".data", "submissions.json");

async function readLocal(): Promise<Submission[]> {
  try {
    return JSON.parse(await fs.readFile(localFile, "utf8"));
  } catch {
    return [];
  }
}

async function writeLocal(rows: Submission[]) {
  await fs.mkdir(path.dirname(localFile), { recursive: true });
  await fs.writeFile(localFile, JSON.stringify(rows, null, 2));
}

export async function insertSubmission(s: NewSubmission): Promise<string> {
  const id = randomUUID();
  if (sql) {
    await ensureSchema();
    await sql`
      INSERT INTO submissions (id, type, name, email, phone, offer, message, details)
      VALUES (${id}, ${s.type}, ${s.name}, ${s.email}, ${s.phone}, ${s.offer}, ${s.message}, ${JSON.stringify(s.details)}::jsonb)`;
    return id;
  }
  const rows = await readLocal();
  rows.unshift({ ...s, id, created_at: new Date().toISOString(), status: "new" });
  await writeLocal(rows);
  return id;
}

export async function listSubmissions(): Promise<Submission[]> {
  if (sql) {
    await ensureSchema();
    const rows = await sql`SELECT * FROM submissions ORDER BY created_at DESC LIMIT 1000`;
    return rows.map((r) => ({ ...r, created_at: new Date(r.created_at).toISOString() }) as Submission);
  }
  return readLocal();
}

export async function getSubmission(id: string): Promise<Submission | null> {
  if (sql) {
    await ensureSchema();
    const rows = await sql`SELECT * FROM submissions WHERE id = ${id}`;
    return rows[0] ? ({ ...rows[0], created_at: new Date(rows[0].created_at).toISOString() } as Submission) : null;
  }
  return (await readLocal()).find((r) => r.id === id) ?? null;
}

export async function updateStatus(id: string, status: SubmissionStatus) {
  if (sql) {
    await ensureSchema();
    await sql`UPDATE submissions SET status = ${status} WHERE id = ${id}`;
    return;
  }
  const rows = await readLocal();
  const row = rows.find((r) => r.id === id);
  if (row) row.status = status;
  await writeLocal(rows);
}

export async function deleteSubmission(id: string) {
  if (sql) {
    await ensureSchema();
    await sql`DELETE FROM submissions WHERE id = ${id}`;
    return;
  }
  await writeLocal((await readLocal()).filter((r) => r.id !== id));
}
