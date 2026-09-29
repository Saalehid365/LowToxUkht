"use client";

import { useEffect, useRef, useState } from "react";

// Fades a block up the first time it scrolls into view.
export function Reveal({ children, className = "", as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "section" | "li" }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} className={`reveal${shown ? " is-in" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

// Large statement whose words light up one by one as it crosses the middle of the screen.
export function TaglineReveal({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [lit, setLit] = useState(0);
  const words = lines.flatMap((line, li) => line.split(" ").map((w, wi) => ({ w, br: wi === 0 && li > 0 })));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(words.length);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top reaches 85% of the viewport, 1 when its bottom reaches 45%.
      const progress = (vh * 0.85 - r.top) / (r.height + vh * 0.4);
      setLit(Math.max(0, Math.min(words.length, Math.round(progress * words.length))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) window.addEventListener("scroll", onScroll, { passive: true });
      else window.removeEventListener("scroll", onScroll);
    });
    io.observe(el);
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [words.length]);

  return (
    <p ref={ref} className="tagline" aria-label={lines.join(" ")}>
      {words.map(({ w, br }, i) => (
        <span key={i} aria-hidden="true">
          {br && <br />}
          <span className={i < lit ? "lit" : undefined}>{w}</span>{" "}
        </span>
      ))}
    </p>
  );
}
