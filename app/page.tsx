import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
import { LabelHero } from "@/components/LabelHero";
import { Reveal, TaglineReveal } from "@/components/Motion";
import { CtaBand } from "@/components/Sections";

const stuck = [
  "You look after everyone else, and you come last every single day.",
  "You're tired in a way that a good night's sleep doesn't seem to fix.",
  "You want a healthier home, but every account you follow says something different.",
  "Your cupboards are full of products you're no longer sure about.",
];

const areas = [
  { name: "Energy and tiredness", body: "Why you're running on empty, and the small daily habits that refill you." },
  { name: "Stress and overwhelm", body: "Calming routines that fit into real days with children, housework and school runs." },
  { name: "Sleep", body: "Calmer evenings and bedtimes for you and the children." },
  { name: "A low tox home", body: "Cleaning, laundry, cookware and toiletries, swapped one at a time." },
  { name: "Skin and body care", body: "Gentle products for sensitive and eczema prone skin, patch tested first." },
  { name: "Hormones and the pre-teen years", body: "Honest guidance for you and for daughters growing up." },
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
              <Link href="/consultations" className="btn btn-large">
                Book a consultation
              </Link>
              <Link href="/how-it-works" className="link">
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

        <section className="section section-tint" aria-labelledby="areas-heading">
          <div className="wrap">
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
          </div>
        </section>


        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
