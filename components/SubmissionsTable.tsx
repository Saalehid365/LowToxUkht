"use client";

import { useMemo, useState, useTransition } from "react";
import type { Submission } from "@/lib/db";
import { setStatus, removeSubmission } from "@/app/admin/actions";

const STATUSES = ["new", "contacted", "booked", "closed"] as const;
const TYPES = [
  { id: "all", label: "All" },
  { id: "consultation", label: "Consultations" },
  { id: "contact", label: "Messages" },
] as const;

const fmt = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export function SubmissionsTable({ rows }: { rows: Submission[] }) {
  const [type, setType] = useState<(typeof TYPES)[number]["id"]>("all");
  const [status, setStatusFilter] = useState<string>("open");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (type === "all" || r.type === type) &&
        (status === "all" || (status === "open" ? r.status !== "closed" : r.status === status)) &&
        (!q || `${r.name} ${r.email} ${r.message ?? ""}`.toLowerCase().includes(q)),
    );
  }, [rows, type, status, query]);

  return (
    <section aria-label="Submissions list">
      <div className="filters">
        <div className="segmented" role="group" aria-label="Type">
          {TYPES.map((t) => (
            <button key={t.id} aria-pressed={type === t.id} onClick={() => setType(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <label className="filter-select">
          <span className="visually-hidden">Status</span>
          <select value={status} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="open">Open (not closed)</option>
            <option value="all">Any status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {cap(s)}
              </option>
            ))}
          </select>
        </label>
        <input
          type="search"
          className="filter-search"
          placeholder="Search name, email or message"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search submissions"
        />
      </div>

      {shown.length === 0 ? (
        <div className="empty">
          {rows.length === 0 ? (
            <>
              <p>No submissions yet.</p>
              <p className="muted">
                When someone books or sends a message, it appears here. Try it yourself on the{" "}
                <a href="/consultations">consultations page</a>.
              </p>
            </>
          ) : (
            <p>Nothing matches these filters.</p>
          )}
        </div>
      ) : (
        <ul className="subs">
          {shown.map((r) => (
            <Row key={r.id} row={r} expanded={open === r.id} onToggle={() => setOpen(open === r.id ? null : r.id)} />
          ))}
        </ul>
      )}
    </section>
  );
}

function Row({ row, expanded, onToggle }: { row: Submission; expanded: boolean; onToggle: () => void }) {
  const [pending, start] = useTransition();
  const d = row.details as { household?: string; priorities?: string[]; goals?: string };

  return (
    <li className={`sub${expanded ? " sub-open" : ""}${pending ? " sub-pending" : ""}`}>
      <div className="sub-row">
        <button className="sub-toggle" onClick={onToggle} aria-expanded={expanded}>
          <span className={`dot dot-${row.status}`} aria-hidden="true" />
          <span className="sub-name">{row.name}</span>
          <span className="sub-kind">{row.type === "consultation" ? row.offer ?? "Consultation" : "Message"}</span>
          <span className="sub-date">{fmt.format(new Date(row.created_at))}</span>
        </button>
        <select
          className="status-select"
          value={row.status}
          aria-label={`Status for ${row.name}`}
          onChange={(e) => start(() => setStatus(row.id, e.target.value))}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {cap(s)}
            </option>
          ))}
        </select>
      </div>

      {expanded && (
        <div className="sub-detail">
          <dl>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${row.email}`}>{row.email}</a>
              </dd>
            </div>
            {row.phone && (
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={`tel:${row.phone}`}>{row.phone}</a>
                </dd>
              </div>
            )}
            {d.household && (
              <div>
                <dt>Household</dt>
                <dd>{d.household}</dd>
              </div>
            )}
            {d.priorities && d.priorities.length > 0 && (
              <div>
                <dt>Focus</dt>
                <dd>{d.priorities.join(", ")}</dd>
              </div>
            )}
            {(d.goals || row.message) && (
              <div className="sub-wide">
                <dt>{row.type === "consultation" ? "Notes" : "Message"}</dt>
                <dd className="sub-message">{d.goals || row.message}</dd>
              </div>
            )}
          </dl>
          <div className="sub-actions">
            <a className="btn btn-small" href={`mailto:${row.email}?subject=${encodeURIComponent("Your consultation")}`}>
              Reply by email
            </a>
            <button
              className="link link-danger"
              onClick={() => {
                if (confirm(`Delete the submission from ${row.name}? This cannot be undone.`)) start(() => removeSubmission(row.id));
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

function cap(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}
