"use server";

import { redirect } from "next/navigation";
import { createClient, verifyLogin, startClientSession, endClientSession, resetPassword, PASSWORD_MIN } from "@/lib/clients";

export type FormState = { errors?: Record<string, string>; error?: string; values?: Record<string, string> } | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (fd: FormData, k: string, max = 200) => String(fd.get(k) ?? "").trim().slice(0, max);

// Only allow redirects back to pages on this site.
const safeNext = (v: string) => (v.startsWith("/") && !v.startsWith("//") ? v : "/account");

export async function signUp(_: FormState, fd: FormData): Promise<FormState> {
  const name = text(fd, "name");
  const email = text(fd, "email");
  const phone = text(fd, "phone", 50);
  const password = String(fd.get("password") ?? "");
  const values = { name, email, phone };

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Enter your name.";
  if (!EMAIL.test(email)) errors.email = "Enter an email address like name@example.com.";
  if (password.length < PASSWORD_MIN) errors.password = `Use at least ${PASSWORD_MIN} characters.`;
  if (Object.keys(errors).length) return { errors, values };

  const id = await createClient({ name, email, phone: phone || null, password });
  if (!id) return { errors: { email: "An account with this email already exists. Sign in instead." }, values };

  await startClientSession(id);
  redirect(safeNext(text(fd, "next", 500)));
}

export async function signIn(_: FormState, fd: FormData): Promise<FormState> {
  const email = text(fd, "email");
  const password = String(fd.get("password") ?? "");
  const values = { email };
  if (!email || !password) return { error: "Enter your email and password.", values };

  const result = await verifyLogin(email, password);
  if (!result.ok)
    return {
      error:
        result.reason === "locked"
          ? "Too many attempts. Wait 15 minutes, then try again."
          : "That email and password don't match. Check them and try again.",
      values,
    };

  await startClientSession(result.clientId);
  redirect(safeNext(text(fd, "next", 500)));
}

export async function signOut() {
  await endClientSession();
  redirect("/account/sign-in");
}

export async function setNewPassword(_: FormState, fd: FormData): Promise<FormState> {
  const password = String(fd.get("password") ?? "");
  if (password.length < PASSWORD_MIN) return { errors: { password: `Use at least ${PASSWORD_MIN} characters.` } };
  const id = await resetPassword(text(fd, "token", 200), password);
  if (!id) return { error: "This reset link has expired or already been used. Ask for a new one." };
  await startClientSession(id);
  redirect("/account");
}
