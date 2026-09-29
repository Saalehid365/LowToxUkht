import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
import { LabelHero } from "@/components/LabelHero";
import { site } from "@/lib/site";

const rooms = [
  {
    name: "Kitchen",
    items: ["Scratched non-stick pans", "Food stored warm in plastic", "Antibacterial dish soap", "Tap water you have never tested"],
  },
  {
    name: "Bathroom",
    items: ["Fragranced shampoo and body wash", "Aerosol deodorant and hairspray", "Air fresheners and plug-ins", "Vinyl shower curtains"],
  },
  {
    name: "Laundry",
    items: ["Fabric softener and dryer sheets", "Scented detergent pods", "Optical brighteners", "Dry-cleaning solvents"],
  },
  {
    name: "Bedroom & nursery",
    items: ["Flame-retardant foam", "New-furniture off-gassing", "Synthetic bedding finishes", "Plastic toys and teethers"],
  },
];

const steps = [
  { title: "Tell me about your home", body: "A short questionnaire about who lives with you, what you use and what worries you most." },
  { title: "We go through it together", body: "On video or in person, we look at real labels, cupboard by cupboard. No judgement, no scare tactics." },
  { title: "You get a swap plan", body: "A written plan ranked by impact and cost, so you change what matters first and never replace everything at once." },
  { title: "I stay with you", body: "Follow-up by email or in session while you make the changes, so the plan becomes habit." },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero wrap">
          <div className="hero-copy">
            <h1>Know what&rsquo;s in your home.</h1>
            <p className="lede">
              One-to-one consulting that finds the hidden toxins in your cleaning cupboard, bathroom shelf and kitchen,
              and replaces them with things you&rsquo;d happily read the label of.
            </p>
            <div className="actions">
              <Link href="/consultations" className="btn">
                Book a consultation
              </Link>
              <Link href="#approach" className="link">
                How it works
              </Link>
            </div>
          </div>
          <LabelHero />
        </section>

        <section className="section wrap" aria-labelledby="rooms-heading">
          <div className="section-intro">
            <h2 id="rooms-heading">Where it hides</h2>
            <p>
              Most exposure comes from ordinary things used every day. These are the places we usually start.
            </p>
          </div>
          <div className="rooms">
            {rooms.map((r) => (
              <div className="room" key={r.name}>
                <h3>{r.name}</h3>
                <ul>
                  {r.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="approach" className="section section-tint" aria-labelledby="approach-heading">
          <div className="wrap">
            <div className="section-intro">
              <h2 id="approach-heading">How we work together</h2>
              <p>Calm, practical and paced around your budget. Most clients see their home differently after the first session.</p>
            </div>
            <ol className="steps">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <span className="step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="about" className="section wrap about" aria-labelledby="about-heading">
          {/* Replace with your portrait: put photo.jpg in /public and swap this div for <img src="/photo.jpg" alt="..." /> */}
          <div className="portrait" aria-hidden="true">
            <span>Your photo</span>
          </div>
          <div className="about-copy">
            <h2 id="about-heading">Hello, I&rsquo;m your coach.</h2>
            <p>
              I started reading labels after my own health changed and nothing in my routine explained why. What I found
              in my own cupboards surprised me, and fixing it was far simpler than I expected.
            </p>
            <p>
              Now I help families do the same thing without the overwhelm: evidence-led, budget-aware and one room at a
              time. You don&rsquo;t need to throw everything out. You need to know which few things matter.
            </p>
            <p className="signature">{site.name}</p>
          </div>
        </section>

        {/* Placeholder testimonials: replace with real client words before launch. */}
        <section className="section section-tint" aria-labelledby="words-heading">
          <div className="wrap">
            <h2 id="words-heading" className="visually-hidden">
              What clients say
            </h2>
            <div className="quotes">
              <blockquote>
                <p>&ldquo;I expected to be told to bin everything. Instead I got a list of six swaps and the reasons behind each one.&rdquo;</p>
                <footer>Client name, mother of two</footer>
              </blockquote>
              <blockquote>
                <p>&ldquo;The water and cookware review alone was worth it. Clear, kind and never alarmist.&rdquo;</p>
                <footer>Client name, Home reset</footer>
              </blockquote>
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="wrap cta-inner">
            <h2>Start with a free twenty-minute call.</h2>
            <Link href="/consultations" className="btn btn-light">
              Book a consultation
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
