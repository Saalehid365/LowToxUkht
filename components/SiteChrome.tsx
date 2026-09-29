import Link from "next/link";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="wordmark" aria-label={`${site.name} home`}>
          {site.name}
        </Link>
        <nav aria-label="Main">
          <Link href="/#approach">Approach</Link>
          <Link href="/#about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/consultations" className="btn btn-small">
            Book a consultation
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div>
          <p className="wordmark">{site.name}</p>
          <p className="muted">{site.tagline}</p>
        </div>
        <div className="footer-links">
          <Link href="/consultations">Consultations</Link>
          <Link href="/contact">Contact</Link>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.instagram}>Instagram</a>
        </div>
        <p className="muted small footer-note">
          Guidance is educational and does not replace advice from your doctor. © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
