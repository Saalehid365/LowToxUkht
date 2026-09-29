"use client";

import { useState } from "react";

export function useSubmit() {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  async function submit(payload: Record<string, unknown>) {
    setPending(true);
    setErrors({});
    setFormError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return true;
      if (data.errors) setErrors(data.errors);
      else setFormError(data.error ?? "Your details were not sent. Try again, or email us directly.");
      return false;
    } catch {
      setFormError("You appear to be offline. Check your connection and try again, or email us directly.");
      return false;
    } finally {
      setPending(false);
    }
  }

  return { submit, pending, errors, formError };
}

export function FieldError({ msg }: { msg?: string }) {
  return msg ? <small className="field-error">{msg}</small> : null;
}
