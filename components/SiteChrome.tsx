import Link from "next/link";
import { site } from "@/lib/site";
import { NavMenu } from "./NavMenu";

export const navLinks = [
  { href: "/#why", label: "Why me" },
  { href: "/#how", label: "How it works" },
  { href: "/consultations", label: "Consultations" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-pill">
          <Link href="/" className="wordmark" aria-label={`${site.name} home`}>
            {site.name}
          </Link>
          <NavMenu links={navLinks} />
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div>
          <p className="wordmark">{site.name}</p>
          <p className="footer-tag">{site.tagline}</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link href="/consultations">Consultations</Link>
          <Link href="/intake">Family intake form</Link>
          <Link href="/contact">Contact</Link>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.instagram}>Instagram</a>
        </nav>
        <div className="footer-note">
          <p>
            Wellness education and lifestyle guidance, not medical advice. Please keep following advice from your GP and
            other health professionals.
          </p>
          <p>
            <Link href="/privacy">Privacy policy</Link> <span aria-hidden="true">/</span> © {new Date().getFullYear()}{" "}
            {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
