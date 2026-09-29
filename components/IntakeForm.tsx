"use client";

import { useEffect, useRef, useState } from "react";
import { intakeSections, validateFields, type Field, type IntakeAnswers } from "@/lib/intake";
import { site } from "@/lib/site";

const DRAFT_KEY = "intake-draft-v1";

function loadDraft(): IntakeAnswers | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function IntakeForm({ prefill }: { prefill: IntakeAnswers }) {
  const [answers, setAnswers] = useState<IntakeAnswers>(() => ({ signedDate: new Date().toISOString().slice(0, 10), ...prefill }));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [restored, setRestored] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shownView = useRef("0");

  // Restore an unfinished form from this device, so a long form is never lost.
  useEffect(() => {
    const draft = loadDraft();
    // Only count answers the person typed, not today's date or details passed in from booking.
    const typed = (k: string, v: string | string[]) =>
      k !== "signedDate" && (Array.isArray(v) ? v.length > 0 : Boolean(v) && v !== prefill[k]);
    if (draft && Object.entries(draft).some(([k, v]) => typed(k, v))) {
      setAnswers((a) => ({ ...a, ...draft, ...Object.fromEntries(Object.entries(prefill).filter(([, v]) => v)) }));
      setRestored(true);
    }
  }, [prefill]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
    } catch {}
  }, [answers]);

  // When the step changes, bring the new section into view and move focus to its heading.
  useEffect(() => {
    const view = sent ? "sent" : String(step);
    if (shownView.current === view) return;
    shownView.current = view;
    headingRef.current?.focus({ preventScroll: true });
    const top = headingRef.current?.closest("section")?.getBoundingClientRect().top;
    if (top !== undefined) {
      const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: window.scrollY + top - 112, behavior: smooth ? "smooth" : "auto" });
    }
  }, [step, sent]);

  const section = intakeSections[step];
  const last = step === intakeSections.length - 1;
  const fields = section.groups.flatMap((g) => g.fields);

  function set(id: string, value: string | string[]) {
    setAnswers((a) => ({ ...a, [id]: value }));
    if (errors[id]) setErrors(({ [id]: _, ...rest }) => rest);
  }

  function checkStep() {
    const e = validateFields(fields, answers);
    setErrors(e);
    const firstBad = Object.keys(e)[0];
    if (firstBad) document.getElementById(`f-${firstBad}`)?.focus();
    return !firstBad;
  }

  async function next(e: React.FormEvent) {
    e.preventDefault();
    if (!checkStep()) return;
    if (!last) return setStep(step + 1);

    setPending(true);
    setFormError("");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, company: (document.getElementById("f-company") as HTMLInputElement)?.value }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {}
        setSent(true);
      } else if (data.errors) {
        // A field on an earlier step failed server checks: take them there.
        const bad = Object.keys(data.errors)[0];
        const at = intakeSections.findIndex((s) => s.groups.some((g) => g.fields.some((f) => f.id === bad)));
        setErrors(data.errors);
        if (at >= 0) setStep(at);
      } else setFormError(data.error ?? "Your form was not sent. Try again in a moment.");
    } catch {
      setFormError("You appear to be offline. Your answers are saved on this device, so reconnect and press send again.");
    } finally {
      setPending(false);
    }
  }

  if (sent)
    return (
      <section className="intake-done" aria-live="polite">
        <h2 ref={headingRef} tabIndex={-1}>
          JazakAllahu khayran, {String(answers.parentName).split(" ")[0]}.
        </h2>
        <p>
          Your intake form has been sent. I&rsquo;ll read it carefully before we meet, so our time together is spent on
          guidance rather than questions.
        </p>
        <p className="muted">If anything changes before your session, email me at <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </section>
    );

  return (
    <section className="intake" aria-labelledby="intake-step-title">
      <nav className="intake-progress" aria-label="Form sections">
        <p className="intake-count">
          Section {step + 1} of {intakeSections.length}
        </p>
        <div className="intake-bar" aria-hidden="true">
          <span style={{ width: `${((step + 1) / intakeSections.length) * 100}%` }} />
        </div>
        <ol>
          {intakeSections.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                aria-current={i === step ? "step" : undefined}
                className={i < step ? "done" : undefined}
                disabled={i > step}
                onClick={() => setStep(i)}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <form className="intake-body" onSubmit={next} noValidate>
        {restored && step === 0 && (
          <p className="notice" role="status">
            We&rsquo;ve restored the answers you started on this device.
          </p>
        )}
        <h2 id="intake-step-title" ref={headingRef} tabIndex={-1}>
          {section.title}
        </h2>
        {section.intro && <p className="intake-intro">{section.intro}</p>}
        {section.id === "consent" && section.notes?.paragraphs?.map((p) => <p key={p} className="intake-fine">{p}</p>)}

        {section.groups.map((g, gi) => (
          <div className="intake-group" key={gi}>
            {g.title && <h3>{g.title}</h3>}
            {g.fields.map((f) => (
              <FieldInput key={f.id} field={f} value={answers[f.id]} error={errors[f.id]} onChange={(v) => set(f.id, v)} />
            ))}
          </div>
        ))}

        {section.id !== "consent" && section.notes && (
          <aside className="intake-note">
            {section.notes.title && <h3>{section.notes.title}</h3>}
            {section.notes.paragraphs?.map((p) => <p key={p}>{p}</p>)}
            {section.notes.items && (
              <ul>
                {section.notes.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            )}
          </aside>
        )}

        <input id="f-company" type="text" name="company" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />

        {Object.keys(errors).length > 0 && (
          <p className="form-error" role="alert">
            Some answers need attention before you continue.
          </p>
        )}
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <div className="intake-nav">
          {step > 0 && (
            <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          <button className="btn" type="submit" disabled={pending}>
            {last ? (pending ? "Sending your form…" : "Send intake form") : `Continue to ${intakeSections[step + 1].title.toLowerCase()}`}
          </button>
        </div>
        <p className="muted small">Your answers are saved on this device as you go.</p>
      </form>
    </section>
  );
}

function FieldInput({
  field: f,
  value,
  error,
  onChange,
}: {
  field: Field;
  value: string | string[] | undefined;
  error?: string;
  onChange: (v: string | string[]) => void;
}) {
  const id = `f-${f.id}`;
  const err = error ? <small className="field-error" id={`${id}-err`}>{error}</small> : null;
  const describedBy = error ? `${id}-err` : undefined;

  if (f.kind === "checks") {
    const picked = Array.isArray(value) ? value : [];
    const long = f.options.some((o) => o.length > 48);
    return (
      <fieldset className="field" aria-describedby={describedBy}>
        <legend>{f.label}</legend>
        <div className={long ? "checklist" : "chips"}>
          {f.options.map((o, i) => (
            <label key={o} className={long ? "check" : "chip"}>
              <input
                id={i === 0 ? id : undefined}
                type="checkbox"
                checked={picked.includes(o)}
                disabled={!picked.includes(o) && !!f.max && picked.length >= f.max}
                onChange={(e) => onChange(e.target.checked ? [...picked, o] : picked.filter((p) => p !== o))}
              />
              <span>{o}</span>
            </label>
          ))}
        </div>
        {f.max && <small className="muted">{picked.length} of {f.max} chosen</small>}
        {err}
      </fieldset>
    );
  }

  if (f.kind === "choice") {
    return (
      <fieldset className="field" aria-describedby={describedBy}>
        <legend>{f.label}</legend>
        <div className="chips">
          {f.options.map((o, i) => (
            <label key={o} className="chip">
              <input id={i === 0 ? id : undefined} type="radio" name={f.id} checked={value === o} onChange={() => onChange(o)} />
              <span>{o}</span>
            </label>
          ))}
        </div>
        {err}
      </fieldset>
    );
  }

  const common = {
    id,
    value: typeof value === "string" ? value : "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    "aria-invalid": !!error,
    "aria-describedby": describedBy,
    required: f.required,
  };
  return (
    <div className="field">
      <label htmlFor={id}>
        {f.label}
        {!f.required && <em>optional</em>}
      </label>
      {f.kind === "textarea" ? (
        <textarea rows={3} {...common} />
      ) : (
        <input
          type={f.kind}
          autoComplete={{ parentName: "name", email: "email", phone: "tel", town: "address-level2" }[f.id]}
          {...common}
        />
      )}
      {err}
    </div>
  );
}
