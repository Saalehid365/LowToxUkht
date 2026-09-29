"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { site } from "@/lib/site";

export default function Login() {
  const [error, action, pending] = useActionState(login, null);

  return (
    <main className="login">
      <form action={action} className="panel form login-panel">
        <p className="wordmark">{site.name}</p>
        <h1>Dashboard sign in</h1>
        <label className="field">
          <span>Password</span>
          <input name="password" type="password" autoComplete="current-password" autoFocus required />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
