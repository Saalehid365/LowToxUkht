import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head wrap contact">
          <div>
            <h1>Get in touch</h1>
            <p className="lede">
              A question about a product, a talk for your masjid, school or sisters&rsquo; circle, or not sure which
              option suits you? Send a note and I&rsquo;ll reply within one working day.
            </p>
            <dl className="contact-details">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </dd>
              </div>
              <div>
                <dt>Sessions</dt>
                <dd>{site.location}</dd>
              </div>
              <div>
                <dt>Ready to book?</dt>
                <dd>
                  <Link href="/consultations">See consultations</Link>
                </dd>
              </div>
            </dl>
          </div>
          <ContactForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
