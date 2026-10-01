"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin, passwordMatches, startSession, endSession } from "@/lib/auth";
import { createResetLink, deleteClient } from "@/lib/clients";
import { updateStatus, deleteSubmission, STATUSES, type SubmissionStatus } from "@/lib/db";

export async function login(_: string | null, fd: FormData) {
  if (!process.env.ADMIN_PASSWORD) return "Set ADMIN_PASSWORD in your environment settings first.";
  if (!passwordMatches(String(fd.get("password") ?? ""))) return "That password is incorrect.";
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function setStatus(id: string, status: string) {
  if (!(await isAdmin())) redirect("/admin/login");
  if (!STATUSES.includes(status as SubmissionStatus)) return;
  await updateStatus(id, status as SubmissionStatus);
  revalidatePath("/admin");
}

export async function removeSubmission(id: string) {
  if (!(await isAdmin())) redirect("/admin/login");
  await deleteSubmission(id);
  revalidatePath("/admin");
}

// Client accounts
async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function makeResetLink(clientId: string) {
  await requireAdmin();
  return `/account/reset/${await createResetLink(clientId)}`;
}

export async function removeClient(clientId: string) {
  await requireAdmin();
  await deleteClient(clientId);
  revalidatePath("/admin/clients");
}
