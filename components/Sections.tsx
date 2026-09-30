import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Motion";
import { Faq, faqs } from "@/components/Faq";

const reasons = [
  {
    title: "I know labels from the inside",
    body: "I built and ran a successful natural products brand. I've formulated, sourced and labelled products myself, so I know where corners get cut and what the word “natural” on the front can hide.",
  },
  {
    title: "Guidance that fits your deen",
    body: "Every suggestion is checked for hidden alcohol, gelatin and other ingredients that matter to Muslim families, and your routines are built around salah, Ramadan and family life.",
  },
  {
    title: "Private, sister to sister",
    body: "Women only, from your own home. Join by phone, WhatsApp or video with your camera off. Nothing is shared without your permission.",
  },
  {
    title: "Gentle and realistic",
    body: "No binning everything, no expensive overhaul. You get a short plan ranked by impact and budget, so you change what matters most first.",
  },
  {
    title: "Care for the whole family",
    body: "Support that includes your children, with real experience of autism and sensory needs. Everyone shares one simple routine, so nobody feels singled out.",
  },
  {
    title: "Safety always comes first",
    body: "I'm a certified holistic health coach. I check allergies and medications before recommending anything, and I work alongside your GP, never instead of them.",
  },
];

const steps = [
  { title: "Book your consultation", body: "Choose the support that suits you and pick a time. Everything happens from home, by phone, WhatsApp or video." },
  { title: "Tell me about your family", body: "A private intake form covers health, routines and what you've already tried, so no session time is wasted." },
  { title: "Change things gently, together", body: "A 60 minute first session and your written plan, then follow ups every 2 to 3 weeks while the changes settle in." },
];

export function Reasons() {
  return (
    <section className="section section-tint" aria-labelledby="why-heading">
      <div className="wrap">
        <Reveal className="section-intro">
          <h2 id="why-heading">Why women work with me</h2>
          <p>Wellness advice is everywhere. Advice from someone who understands your home, your faith and the products on your shelf is much harder to find.</p>
        </Reveal>
        <div className="reasons">
          {reasons.map((r) => (
            <Reveal key={r.title} className="reason">
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Steps() {
  return (
    <section className="section section-tint" aria-labelledby="how-heading">
      <div className="wrap">
        <Reveal className="section-intro">
          <h2 id="how-heading">Three simple steps</h2>
          <p>All from home, at a pace that suits your family.</p>
        </Reveal>
        <ol className="steps">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title}>
              <span className="step-num" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="section wrap faq-wrap" aria-labelledby="faq-heading">
      <Reveal className="faq-intro">
        <h2 id="faq-heading">Questions women often ask</h2>
        <p>
          Something else on your mind? <Link href="/contact">Send me a message</Link>.
        </p>
      </Reveal>
      <Faq />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
    </section>
  );
}

// Public domain (CC0) photo via rawpixel. Swap public/botanicals.jpg to change it.
export function Portrait() {
  return (
    <Reveal className="portrait">
      <Image
        src="/botanicals.jpg"
        alt="Amber glass dropper bottles beside soft white flowers on a wooden table"
        fill
        sizes="(min-width: 900px) 440px, 320px"
      />
    </Reveal>
  );
}

export function CtaBand({ title = "Take the first gentle step." }: { title?: string }) {
  return (
    <section className="cta-band">
      <div className="wrap cta-inner">
        <div>
          <h2>{title}</h2>
          <p>Private, one to one support from home, by phone, WhatsApp or video.</p>
        </div>
        <Link href="/consultations" className="btn btn-light btn-large">
          Book a consultation
        </Link>
      </div>
    </section>
  );
}
