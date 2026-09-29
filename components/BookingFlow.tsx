"use client";

import { useEffect, useRef, useState } from "react";
import { offers, priorities, site } from "@/lib/site";
import { useSubmit, FieldError } from "./useSubmit";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(opts: { url: string; parentElement: HTMLElement; prefill?: Record<string, string> }): void;
    };
  }
}

export function BookingFlow({ defaultOffer, calendlyUrl }: { defaultOffer: string; calendlyUrl: string }) {
  const { submit, pending, errors, formError } = useSubmit();
  const [booked, setBooked] = useState<{ name: string; email: string; intake: boolean } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      type: "consultation",
      offer: fd.get("offer"),
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      household: fd.get("household"),
      priorities: fd.getAll("priorities"),
      goals: fd.get("goals"),
      company: fd.get("company"),
    };
    if (await submit(payload))
      setBooked({ name: String(payload.name), email: String(payload.email), intake: !!offers.find((o) => o.id === payload.offer)?.intake });
  }

  if (booked) return <ScheduleStep {...booked} calendlyUrl={calendlyUrl} />;

  return (
    <form className="form panel" onSubmit={onSubmit} noValidate>
      <p className="step-label">Step 1 of 2: About you</p>

      <fieldset className="field">
        <legend>Consultation</legend>
        <div className="choice-row">
          {offers.map((o) => (
            <label key={o.id} className="choice">
              <input type="radio" name="offer" value={o.id} defaultChecked={o.id === defaultOffer} />
              <span>
                {o.name}
                <small>{o.price}</small>
              </span>
            </label>
          ))}
        </div>
        <FieldError msg={errors.offer} />
      </fieldset>

      <div className="field-row">
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
      </div>

      <div className="field-row">
        <label className="field">
          <span>
            Phone <em>optional</em>
          </span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label className="field">
          <span>
            Who lives at home with you? <em>optional</em>
          </span>
          <input name="household" placeholder="e.g. my husband, a 12 year old and a toddler" />
        </label>
      </div>

      <fieldset className="field">
        <legend>
          What would you like to focus on? <em>optional</em>
        </legend>
        <div className="chips">
          {priorities.map((p) => (
            <label key={p} className="chip">
              <input type="checkbox" name="priorities" value={p} />
              <span>{p}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span>
          What feels heaviest right now? <em>optional</em>
        </span>
        <textarea name="goals" rows={4} placeholder="Tiredness, a child who struggles with sleep, a product you are unsure about…" />
      </label>

      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />

      {formError && (
        <p className="form-error" role="alert">
          {formError} <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      )}

      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Saving your details…" : "Continue to choose a time"}
      </button>
    </form>
  );
}

function ScheduleStep({ name, email, intake, calendlyUrl }: { name: string; email: string; intake: boolean; calendlyUrl: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    heading.current?.focus();
    if (!calendlyUrl || !ref.current) return;
    const el = ref.current;
    const init = () => window.Calendly?.initInlineWidget({ url: calendlyUrl, parentElement: el, prefill: { name, email } });
    if (window.Calendly) return init();
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = init;
    document.body.appendChild(script);
  }, [calendlyUrl, name, email]);

  return (
    <div className="panel schedule">
      <p className="step-label" ref={heading} tabIndex={-1}>
        Step 2 of 2: Choose a time
      </p>
      <p>
        Thank you, {name.split(" ")[0]}. Your details are saved.{" "}
        {calendlyUrl ? "Pick a time below and you'll get a calendar invite by email." : "I'll email you within one working day to arrange a time."}
      </p>
      {calendlyUrl && <div ref={ref} className="calendly" />}
      {intake && (
      <div className="schedule-next">
        <p>
          <strong>Next, your family intake form.</strong> It takes about 15 minutes and helps me prepare properly for
          your first session.
        </p>
        <a className="btn" href={`/intake?${new URLSearchParams({ name, email })}`}>
          Complete the intake form
        </a>
      </div>
      )}
    </div>
  );
}
