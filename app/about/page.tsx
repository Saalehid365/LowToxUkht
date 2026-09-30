import type { Metadata } from "next";
import { Header, Footer } from "@/components/SiteChrome";
import { Reveal } from "@/components/Motion";
import { Reasons, Portrait, CtaBand } from "@/components/Sections";
import { testimonials } from "@/lib/site";

export const metadata: Metadata = {
  title: "About me",
  description: "Certified holistic health coach and former founder of a natural products brand, helping Muslim women feel like themselves again.",
};

export default function About() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="wrap about about-page" aria-labelledby="about-heading">
          <Portrait />
          <div className="about-copy">
            <h1 id="about-heading">Assalamu alaikum, I&rsquo;m so glad you&rsquo;re here.</h1>
            <p>
              For years I ran a natural products brand. I formulated, sourced and sold products that families trusted,
              and I learned exactly what goes into the things we put on our skin and use in our homes.
            </p>
            <p>
              I also learned how many women were quietly struggling: exhausted, overwhelmed and unsure where to start.
              So I trained as a holistic health coach, and now I sit beside women like you and help them take their
              first steps, gently and in a way that honours their faith.
            </p>
            <p>You don&rsquo;t have to figure this out alone.</p>
          </div>
        </section>

        <Reasons />

        {testimonials.length > 0 && (
          <section className="section wrap" aria-labelledby="words-heading">
            <Reveal>
              <h2 id="words-heading">In their words</h2>
            </Reveal>
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
          </section>
        )}

        <CtaBand title="Let's take the first step together." />
      </main>
      <Footer />
    </>
  );
}
