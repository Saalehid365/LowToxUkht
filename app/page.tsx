import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
import { LabelHero } from "@/components/LabelHero";
import { Reveal, TaglineReveal } from "@/components/Motion";
import { Faq, faqs } from "@/components/Faq";
import { testimonials } from "@/lib/site";

const stuck = [
  "You look after everyone else, and you come last every single day.",
  "You're tired in a way that a good night's sleep doesn't seem to fix.",
  "You want a healthier home, but every account you follow says something different.",
  "Your cupboards are full of products you're no longer sure about.",
];

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

const areas = [
  { name: "Energy and tiredness", body: "Why you're running on empty, and the small daily habits that refill you." },
  { name: "Stress and overwhelm", body: "Calming routines that fit into real days with children, housework and school runs." },
  { name: "Sleep", body: "Calmer evenings and bedtimes for you and the children." },
  { name: "A low tox home", body: "Cleaning, laundry, cookware and toiletries, swapped one at a time." },
  { name: "Skin and body care", body: "Gentle products for sensitive and eczema prone skin, patch tested first." },
  { name: "Hormones and the pre-teen years", body: "Honest guidance for you and for daughters growing up." },
];

const steps = [
  { title: "Book a free discovery call", body: "Twenty minutes to talk about where you are and whether I can help. No pressure, no obligation." },
  { title: "Tell me about your family", body: "A private intake form covers health, routines and what you've already tried, so no session time is wasted." },
  { title: "Change things gently, together", body: "A 60 minute first session and your written plan, then follow ups every 2 to 3 weeks while the changes settle in." },
];

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="hero-kicker">Holistic wellness for Muslim women at home</p>
            <h1>
              Feel like yourself again,
              <br /> one gentle change at a time.
            </h1>
            <p className="lede">
              I spent years writing ingredient labels for my own natural products brand. Now I help you read yours, and
              build a calmer, healthier home that fits around your family and your faith.
            </p>
            <div className="actions">
              <Link href="/consultations#book" className="btn btn-large">
                Book a free 20 minute call
              </Link>
              <Link href="#how" className="link">
                See how it works
              </Link>
            </div>
            <ul className="proof" aria-label="Credentials">
              <li>Certified holistic health coach</li>
              <li>Founder of a successful natural products brand</li>
              <li>Private sessions, women only</li>
            </ul>
          </div>
          <LabelHero />
        </section>

        <section className="section section-deep" aria-labelledby="stuck-heading">
          <div className="wrap stuck">
            <Reveal>
              <h2 id="stuck-heading">If you feel stuck, you&rsquo;re not alone.</h2>
              <p className="stuck-intro">Most of the women I work with arrive feeling some version of this.</p>
            </Reveal>
            <ul className="stuck-list">
              {stuck.map((s) => (
                <Reveal as="li" key={s}>
                  {s}
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="section wrap tagline-wrap" aria-label="My approach">
          <TaglineReveal
            lines={["You don't need to change everything.", "You need to know which few things matter,", "and a sister to walk with you."]}
          />
        </section>

        <section id="why" className="section section-tint" aria-labelledby="why-heading">
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

        <section className="section wrap" aria-labelledby="areas-heading">
          <Reveal className="section-intro">
            <h2 id="areas-heading">What we can work on</h2>
            <p>Most women choose two or three areas to start with. We go at your pace.</p>
          </Reveal>
          <ul className="areas">
            {areas.map((a) => (
              <Reveal as="li" key={a.name}>
                <h3>{a.name}</h3>
                <p>{a.body}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        <section id="how" className="section section-tint" aria-labelledby="how-heading">
          <div className="wrap">
            <Reveal className="section-intro">
              <h2 id="how-heading">How it works</h2>
              <p>Three simple steps, all from home, at a pace that suits your family.</p>
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

        <section id="about" className="section wrap about" aria-labelledby="about-heading">
          {/* Replace with your portrait: put photo.jpg in /public and swap this div for <img src="/photo.jpg" alt="..." /> */}
          <Reveal className="portrait">
            <span>Your photo</span>
          </Reveal>
          <Reveal className="about-copy">
            <h2 id="about-heading">Assalamu alaikum, I&rsquo;m so glad you&rsquo;re here.</h2>
            <p>
              For years I ran a natural products brand. I formulated, sourced and sold products that families
              trusted, and I learned exactly what goes into the things we put on our skin and use in our homes.
            </p>
            <p>
              I also learned how many women were quietly struggling: exhausted, overwhelmed and unsure where to start.
              So I trained as a holistic health coach, and now I sit beside women like you and help them take their
              first steps, gently and in a way that honours their faith.
            </p>
            <p>You don&rsquo;t have to figure this out alone.</p>
          </Reveal>
        </section>

        {testimonials.length > 0 && (
          <section className="section section-tint" aria-labelledby="words-heading">
            <div className="wrap">
              <h2 id="words-heading">In their words</h2>
              <div className="quotes">
                {testimonials.map((t) => (
                  <blockquote key={t.name}>
                    <p>&ldquo;{t.quote}&rdquo;</p>
                    <footer>
                      {t.name}, {t.detail}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="faq" className="section wrap faq-wrap" aria-labelledby="faq-heading">
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

        <section className="cta-band">
          <div className="wrap cta-inner">
            <div>
              <h2>Take the first gentle step.</h2>
              <p>A free, private 20 minute call. No pressure and no obligation.</p>
            </div>
            <Link href="/consultations#book" className="btn btn-light btn-large">
              Book a free 20 minute call
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
