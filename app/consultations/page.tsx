import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
import { BookingFlow } from "@/components/BookingFlow";
import { offers } from "@/lib/site";

export const metadata: Metadata = { title: "Consultations" };

export default async function Consultations({ searchParams }: { searchParams: Promise<{ offer?: string }> }) {
  const { offer } = await searchParams;
  const selected = offers.some((o) => o.id === offer) ? offer! : "home-reset";

  return (
    <>
      <Header />
      <main>
        <section className="page-head wrap">
          <h1>Consultations</h1>
          <p className="lede">
            Choose the level of support that fits your home. Every consultation is one-to-one, held on video or in
            person, and ends with something practical you can act on.
          </p>
        </section>

        <section className="wrap offers" aria-label="Consultation options">
          {offers.map((o) => (
            <article key={o.id} className={`offer${o.featured ? " offer-featured" : ""}`}>
              {o.featured && <p className="offer-flag">Most chosen</p>}
              <h2>{o.name}</h2>
              <p className="offer-price">{o.price}</p>
              <p className="offer-length">{o.length}</p>
              <p>{o.summary}</p>
              <ul>
                {o.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <Link href={`/consultations?offer=${o.id}#book`} scroll={false} className={o.featured ? "btn" : "btn btn-ghost"}>
                Choose {o.name.toLowerCase()}
              </Link>
            </article>
          ))}
        </section>

        <section id="book" className="section section-tint" aria-labelledby="book-heading">
          <div className="wrap book">
            <div className="book-intro">
              <h2 id="book-heading">Book your consultation</h2>
              <p>Two short steps. Tell me a little about your home, then choose a time that suits you.</p>
              <p className="muted small">
                Questions first? <Link href="/contact">Send a message</Link> instead.
              </p>
            </div>
            <BookingFlow key={selected} defaultOffer={selected} calendlyUrl={process.env.NEXT_PUBLIC_CALENDLY_URL ?? ""} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
