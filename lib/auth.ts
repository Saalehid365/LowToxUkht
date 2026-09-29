import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "lto_admin";

function sessionToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("admin-session-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function passwordMatches(input: string) {
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(password) && safeEqual(input, password!);
}

// With no ADMIN_PASSWORD set, the dashboard is open to anyone with the link.
export const passwordEnabled = () => Boolean(process.env.ADMIN_PASSWORD);

export async function isAdmin() {
  const token = sessionToken();
  if (!token) return true;
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return Boolean(value) && safeEqual(value!, token);
}

export async function startSession() {
  const token = sessionToken();
  if (!token) return;
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
