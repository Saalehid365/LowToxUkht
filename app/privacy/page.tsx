import type { Metadata } from "next";
import { Header, Footer } from "@/components/SiteChrome";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy" };

// A plain starting point. Have it checked against your own setup before launch.
export default function Privacy() {
  return (
    <>
      <Header />
      <main id="main" className="wrap page-head prose">
        <h1>Privacy policy</h1>
        <p className="lede">How your information is collected, used and protected, in line with UK GDPR.</p>

        <h2>What I collect</h2>
        <p>
          When you book, send a message or complete the family intake form, I collect the details you choose to share.
          This can include your name, contact details and, on the intake form, health information about your child and
          family.
        </p>

        <h2>Why I collect it</h2>
        <p>
          Only to prepare for and deliver your consultations, and to reply to you. Health information is used with your
          explicit consent, which you give on the intake form.
        </p>

        <h2>Where it is kept</h2>
        <p>
          Your answers are stored in a secure database and sent to me by email so I can prepare for our session.
          Bookings are handled by Calendly. I never sell your information or share it without your permission.
        </p>

        <h2>How long it is kept</h2>
        <p>For as long as we work together, and then only as long as needed for records. You can ask me to delete it at any time.</p>

        <h2>Your rights</h2>
        <p>
          You can ask to see, correct or delete your information at any time. Email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> and I&rsquo;ll respond within one month. You also have the
          right to complain to the Information Commissioner&rsquo;s Office (ico.org.uk).
        </p>
      </main>
      <Footer />
    </>
  );
}
