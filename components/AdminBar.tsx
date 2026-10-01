import Link from "next/link";
import { site } from "@/lib/site";
import { passwordEnabled } from "@/lib/auth";
import { logout } from "@/app/admin/actions";

export function AdminBar({ current }: { current: "submissions" | "journals" | "clients" }) {
  return (
    <header className="admin-bar">
      <div className="wrap admin-bar-inner">
        <Link href="/" className="wordmark">
          {site.name}
        </Link>
        <nav className="admin-nav" aria-label="Dashboard">
          <Link href="/admin" aria-current={current === "submissions" ? "page" : undefined}>
            Submissions
          </Link>
          <Link href="/admin/journals" aria-current={current === "journals" ? "page" : undefined}>
            Client Journals
          </Link>
          <Link href="/admin/clients" aria-current={current === "clients" ? "page" : undefined}>
            Clients
          </Link>
        </nav>
        <div className="admin-bar-actions">
          {current === "submissions" && (
            <a href="/api/admin/export" className="link">
              Download CSV
            </a>
          )}
          {passwordEnabled() && (
            <form action={logout}>
              <button className="btn btn-ghost btn-small">Sign out</button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
