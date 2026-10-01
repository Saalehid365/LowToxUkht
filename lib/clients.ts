import "server-only";
import { cookies } from "next/headers";
import { randomBytes, randomUUID, scrypt as scryptCb, createHash, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { db } from "@/lib/db";

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

export const CLIENT_COOKIE = "ltu_client";
const SESSION_DAYS = 60;
const MAX_FAILED_LOGINS = 8;
const LOCK_MINUTES = 15;
const RESET_HOURS = 72;
export const PASSWORD_MIN = 8;

export type Client = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  child_name: string;
};

function toClient(r: Record<string, unknown>): Client {
  return {
    id: r.id as string,
    created_at: new Date(r.created_at as string).toISOString(),
    name: r.name as string,
    email: r.email as string,
    phone: (r.phone as string) ?? null,
    child_name: (r.child_name as string) ?? "",
  };
}

const token = (bytes = 32) => randomBytes(bytes).toString("base64url");
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");
const normaliseEmail = (e: string) => e.trim().toLowerCase();

// Passwords are stored as salted scrypt hashes, never in plain text.
async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

async function checkPassword(password: string, stored: string) {
  const [, salt, hash] = stored.split("$");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await scrypt(password, Buffer.from(salt, "base64"), expected.length);
  return timingSafeEqual(actual, expected);
}

/** Returns the new client's id, or null if the email is already registered. */
export async function createClient(input: { name: string; email: string; phone: string | null; password: string }) {
  const sql = await db();
  const id = randomUUID();
  const passwordHash = await hashPassword(input.password);
  const rows = await sql`
    INSERT INTO clients (id, name, email, phone, password_hash)
    VALUES (${id}, ${input.name}, ${normaliseEmail(input.email)}, ${input.phone}, ${passwordHash})
    ON CONFLICT (email) DO NOTHING
    RETURNING id`;
  return rows[0] ? id : null;
}

export type SignInResult = { ok: true; clientId: string } | { ok: false; reason: "invalid" | "locked" };

export async function verifyLogin(email: string, password: string): Promise<SignInResult> {
  const sql = await db();
  const [row] = await sql`SELECT id, password_hash, locked_until FROM clients WHERE email = ${normaliseEmail(email)}`;
  if (!row) {
    await hashPassword(password); // similar timing whether or not the account exists
    return { ok: false, reason: "invalid" };
  }
  if (row.locked_until && new Date(row.locked_until) > new Date()) return { ok: false, reason: "locked" };
  if (!(await checkPassword(password, row.password_hash))) {
    await sql`
      UPDATE clients SET
        failed_logins = failed_logins + 1,
        locked_until = CASE WHEN failed_logins + 1 >= ${MAX_FAILED_LOGINS}
          THEN now() + make_interval(mins => ${LOCK_MINUTES}) ELSE locked_until END
      WHERE id = ${row.id}`;
    return { ok: false, reason: "invalid" };
  }
  await sql`UPDATE clients SET failed_logins = 0, locked_until = NULL WHERE id = ${row.id}`;
  return { ok: true, clientId: row.id };
}

// The browser keeps a random token; the database only stores its hash.
export async function startClientSession(clientId: string) {
  const sql = await db();
  const t = token();
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  await sql`INSERT INTO client_sessions (token_hash, client_id, expires_at) VALUES (${sha256(t)}, ${clientId}, ${expires})`;
  await sql`DELETE FROM client_sessions WHERE expires_at < now()`;
  (await cookies()).set(CLIENT_COOKIE, t, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function endClientSession() {
  const jar = await cookies();
  const t = jar.get(CLIENT_COOKIE)?.value;
  if (t) {
    const sql = await db();
    await sql`DELETE FROM client_sessions WHERE token_hash = ${sha256(t)}`;
  }
  jar.delete(CLIENT_COOKIE);
}

export async function getCurrentClient(): Promise<Client | null> {
  const t = (await cookies()).get(CLIENT_COOKIE)?.value;
  if (!t) return null;
  const sql = await db();
  const [row] = await sql`
    SELECT c.* FROM client_sessions s JOIN clients c ON c.id = s.client_id
    WHERE s.token_hash = ${sha256(t)} AND s.expires_at > now()`;
  return row ? toClient(row) : null;
}

export async function setChildName(clientId: string, name: string) {
  const sql = await db();
  await sql`UPDATE clients SET child_name = ${name} WHERE id = ${clientId}`;
}

// Coach side
export type ClientSummary = Client & { nights: number; last_night: string | null };

export async function listClients(): Promise<ClientSummary[]> {
  const sql = await db();
  const rows = await sql`
    SELECT c.*, count(e.night)::int AS nights, max(e.night)::text AS last_night
    FROM clients c LEFT JOIN sleep_entries e ON e.client_id = c.id
    GROUP BY c.id ORDER BY c.created_at DESC LIMIT 1000`;
  return rows.map((r) => ({ ...toClient(r), nights: r.nights as number, last_night: (r.last_night as string) ?? null }));
}

export async function getClient(id: string) {
  const sql = await db();
  const [row] = await sql`SELECT * FROM clients WHERE id = ${id}`;
  return row ? toClient(row) : null;
}

export async function deleteClient(clientId: string) {
  const sql = await db();
  await sql`DELETE FROM clients WHERE id = ${clientId}`;
}

// Password resets: the coach creates a one-time link and sends it to the client.
export async function createResetLink(clientId: string) {
  const sql = await db();
  const t = token();
  await sql`
    UPDATE clients SET reset_token_hash = ${sha256(t)}, reset_expires_at = now() + make_interval(hours => ${RESET_HOURS})
    WHERE id = ${clientId}`;
  return t;
}

export async function findClientByResetToken(t: string) {
  const sql = await db();
  const [row] = await sql`SELECT * FROM clients WHERE reset_token_hash = ${sha256(t)} AND reset_expires_at > now()`;
  return row ? toClient(row) : null;
}

export async function resetPassword(t: string, password: string) {
  const sql = await db();
  const passwordHash = await hashPassword(password);
  const [row] = await sql`
    UPDATE clients SET password_hash = ${passwordHash}, reset_token_hash = NULL, reset_expires_at = NULL,
      failed_logins = 0, locked_until = NULL
    WHERE reset_token_hash = ${sha256(t)} AND reset_expires_at > now()
    RETURNING id`;
  if (!row) return null;
  await sql`DELETE FROM client_sessions WHERE client_id = ${row.id}`; // sign out everywhere
  return row.id as string;
}
