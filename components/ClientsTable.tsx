"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import type { ClientSummary } from "@/lib/clients";
import { makeResetLink, removeClient } from "@/app/admin/actions";
import { site } from "@/lib/site";

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const night = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
};

// wa.me needs an international number without symbols; UK numbers starting 0 become 44.
function whatsappNumber(phone: string | null) {
  if (!phone) return null;
  let d = phone.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  else if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = `44${d.slice(1)}`;
  return d.length >= 10 ? d : null;
}

export function ClientsTable({ clients }: { clients: ClientSummary[] }) {
  if (clients.length === 0)
    return (
      <div className="empty">
        <p>No client accounts yet.</p>
        <p className="muted">
          When a client creates an account, they&rsquo;ll appear here. Try it yourself at{" "}
          <a href="/account/sign-up">/account/sign-up</a>.
        </p>
      </div>
    );

  return (
    <ul className="clients">
      {clients.map((c) => (
        <ClientRow key={c.id} client={c} />
      ))}
    </ul>
  );
}

function ClientRow({ client: c }: { client: ClientSummary }) {
  const [pending, start] = useTransition();
  const [reset, setReset] = useState("");
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);

  const full = reset ? `${origin}${reset}` : "";
  const message = `Assalamu alaikum ${c.name.split(" ")[0]}, here is your link to choose a new password for ${site.name}. It works for 3 days: ${full}`;
  const wa = whatsappNumber(c.phone);

  async function copy() {
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", full);
    }
  }

  return (
    <li className={`client${pending ? " sub-pending" : ""}`}>
      <div className="client-main">
        <div>
          <p className="client-name">{c.name}</p>
          <p className="client-meta">
            <a href={`mailto:${c.email}`}>{c.email}</a>
            {c.phone && <> · {c.phone}</>} · joined {fmt.format(new Date(c.created_at))}
          </p>
          <p className="client-status">
            {c.nights === 0
              ? "No journal nights yet"
              : `${c.nights} night${c.nights === 1 ? "" : "s"} in the sleep journal, latest ${night(c.last_night!)}`}
          </p>
        </div>
        <div className="client-actions">
          <Link className="btn btn-small" href={`/admin/clients/${c.id}`}>
            View journal
          </Link>
          <button
            className="link"
            disabled={pending}
            onClick={() =>
              start(async () => {
                setReset(await makeResetLink(c.id));
              })
            }
          >
            Password reset link
          </button>
          <button
            className="link link-danger"
            disabled={pending}
            onClick={() => {
              if (confirm(`Delete ${c.name}'s account and sleep journal? This can't be undone.`)) start(() => removeClient(c.id));
            }}
          >
            Delete account
          </button>
        </div>
      </div>

      {reset && (
        <div className="client-link">
          <p className="small">Password reset link, valid for 3 days. Send it to the client:</p>
          <div className="client-link-row">
            <input readOnly value={full} aria-label="Password reset link" onFocus={(e) => e.currentTarget.select()} />
            <button className="btn btn-small" onClick={copy}>
              {copied ? "Copied" : "Copy link"}
            </button>
            {wa && (
              <a className="btn btn-small btn-ghost" href={`https://wa.me/${wa}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">
                Send on WhatsApp
              </a>
            )}
            <a className="link" href={`mailto:${c.email}?subject=${encodeURIComponent(site.name)}&body=${encodeURIComponent(message)}`}>
              Email it
            </a>
          </div>
        </div>
      )}
    </li>
  );
}
