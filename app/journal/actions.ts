"use server";

import { getCurrentClient, setChildName } from "@/lib/clients";
import { saveEntry, deleteAllEntries } from "@/lib/journal-db";
import { NIGHT, type SleepEntry } from "@/lib/journal";

type Result<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

const SIGNED_OUT = "You've been signed out. Sign in again, then save.";

export async function saveNight(night: string, data: unknown): Promise<Result<SleepEntry>> {
  const client = await getCurrentClient();
  if (!client) return { ok: false, error: SIGNED_OUT };
  const d = new Date(`${night}T12:00:00Z`);
  // Allow a day of leeway either side of "today" for time zones.
  if (!NIGHT.test(night) || isNaN(+d) || d.getTime() > Date.now() + 864e5 || d.getUTCFullYear() < 2020)
    return { ok: false, error: "Choose a night that isn't in the future." };
  return { ok: true, data: await saveEntry(client.id, night, data) };
}

export async function saveChildName(name: string): Promise<Result> {
  const client = await getCurrentClient();
  if (!client) return { ok: false, error: SIGNED_OUT };
  await setChildName(client.id, String(name ?? "").trim().slice(0, 60));
  return { ok: true };
}

export async function clearJournal(): Promise<Result> {
  const client = await getCurrentClient();
  if (!client) return { ok: false, error: SIGNED_OUT };
  await deleteAllEntries(client.id);
  return { ok: true };
}
