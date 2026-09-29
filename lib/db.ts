import "server-only";
import { neon } from "@neondatabase/serverless";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type SubmissionType = "consultation" | "contact";
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

// The table is created on first use, so there is no separate migration step.
let schemaReady: Promise<unknown> | null = null;
function ensureSchema() {
  if (!sql) return Promise.resolve();
  schemaReady ??= sql`
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
    )`.catch((err) => {
    schemaReady = null;
    throw err;
  });
  return schemaReady;
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
