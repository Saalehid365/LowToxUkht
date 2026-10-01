"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signUp, signIn, setNewPassword, type FormState } from "@/app/account/actions";

function Err({ msg, id }: { msg?: string; id: string }) {
  return msg ? (
    <small className="field-error" id={id}>
      {msg}
    </small>
  ) : null;
}

function PasswordInput({ autoComplete, error }: { autoComplete: string; error?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <label htmlFor="password">Password</label>
      <div className="password">
        <input
          id="password"
          name="password"
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required
          aria-invalid={!!error}
          aria-describedby={error ? "password-err" : undefined}
        />
        <button type="button" className="link" onClick={() => setShow(!show)} aria-pressed={show}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <Err msg={error} id="password-err" />
    </div>
  );
}

export function SignUpForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(signUp, null);
  const e = state?.errors ?? {};
  const v = state?.values ?? {};
  return (
    <form action={action} className="form panel" noValidate>
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" autoComplete="name" defaultValue={v.name} required aria-invalid={!!e.name} />
        <Err msg={e.name} id="name-err" />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} required aria-invalid={!!e.email} />
        <Err msg={e.email} id="email-err" />
      </div>
      <div className="field">
        <label htmlFor="phone">
          Phone / WhatsApp <em>optional</em>
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} />
      </div>
      <PasswordInput autoComplete="new-password" error={e.password} />
      <button className="btn" disabled={pending}>
        {pending ? "Creating your account…" : "Create account"}
      </button>
      <p className="muted small">
        Already have an account? <Link href={`/account/sign-in?next=${encodeURIComponent(next)}`}>Sign in</Link>
      </p>
    </form>
  );
}

export function SignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, null);
  return (
    <form action={action} className="form panel" noValidate>
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" defaultValue={state?.values?.email} required />
      </div>
      <PasswordInput autoComplete="current-password" />
      {state?.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <button className="btn" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="muted small">
        New here? <Link href={`/account/sign-up?next=${encodeURIComponent(next)}`}>Create an account</Link>
        <br />
        Forgotten your password? <Link href="/contact">Message me</Link> and I&rsquo;ll send you a reset link.
      </p>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(setNewPassword, null);
  return (
    <form action={action} className="form panel" noValidate>
      <input type="hidden" name="token" value={token} />
      <PasswordInput autoComplete="new-password" error={state?.errors?.password} />
      {state?.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <button className="btn" disabled={pending}>
        {pending ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}
