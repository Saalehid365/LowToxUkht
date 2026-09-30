"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function NavMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("menu-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-open");
    };
  }, [open]);

  const current = (href: string) => (href === pathname ? "page" : undefined);

  return (
    <>
      <nav className="nav-links" aria-label="Main">
        {links.map((l) => (
          <Link key={l.href} href={l.href} aria-current={current(l.href)}>
            {l.label}
          </Link>
        ))}
      </nav>
      <Link href="/consultations" className="btn btn-small nav-cta">
        Book a consultation
      </Link>
      <button
        type="button"
        className={`burger${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
      </button>
      <div id="mobile-menu" className={`mobile-menu${open ? " is-open" : ""}`} inert={!open} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
        <nav aria-label="Mobile">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} aria-current={current(l.href)} style={{ "--i": i } as React.CSSProperties} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/consultations" className="btn" style={{ "--i": links.length } as React.CSSProperties} onClick={() => setOpen(false)}>
            Book a consultation
          </Link>
        </nav>
      </div>
    </>
  );
}
