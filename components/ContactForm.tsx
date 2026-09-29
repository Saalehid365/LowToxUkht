"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { useSubmit, FieldError } from "./useSubmit";

export function ContactForm() {
  const { submit, pending, errors, formError } = useSubmit();
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ok = await submit({
      type: "contact",
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      message: fd.get("message"),
      company: fd.get("company"),
    });
    if (ok) setSent(true);
  }

  if (sent)
    return (
      <div className="panel" role="status">
        <p className="step-label">Message sent</p>
        <p>Thank you. I&rsquo;ll reply to you by email within one working day.</p>
      </div>
    );

  return (
    <form className="form panel" onSubmit={onSubmit} noValidate>
      <label className="field">
        <span>Name</span>
        <input name="name" autoComplete="name" required aria-invalid={!!errors.name} />
        <FieldError msg={errors.name} />
      </label>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} />
        <FieldError msg={errors.email} />
      </label>
      <label className="field">
        <span>
          Phone <em>optional</em>
        </span>
        <input name="phone" type="tel" autoComplete="tel" />
      </label>
      <label className="field">
        <span>Message</span>
        <textarea name="message" rows={6} required aria-invalid={!!errors.message} />
        <FieldError msg={errors.message} />
      </label>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
      {formError && (
        <p className="form-error" role="alert">
          {formError} <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      )}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
