import type { Metadata } from "next";
import { Header, Footer } from "@/components/SiteChrome";
import { IntakeForm } from "@/components/IntakeForm";
import { intakePackage } from "@/lib/intake";

export const metadata: Metadata = { title: "Family intake form" };

export default async function Intake({ searchParams }: { searchParams: Promise<{ name?: string; email?: string }> }) {
  const { name = "", email = "" } = await searchParams;

  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head wrap intake-head">
          <div>
            <h1>Family intake form</h1>
            <p className="lede">
              Assalamu alaikum, and thank you for booking your {intakePackage.name}. Please complete this at least 48
              hours before your first session, so our time is spent on guidance, not questions.
            </p>
            <p className="muted">
              There are no right or wrong answers. Share as much or as little as feels comfortable, and skip anything
              you would rather talk through in person. Everything you share is kept confidential.
            </p>
          </div>
          <div className="package">
            <h2>Your package</h2>
            <ol>
              {intakePackage.sessions.map((s) => (
                <li key={s.name}>
                  <div>
                    <strong>{s.name}</strong>
                    <span>{s.length}</span>
                  </div>
                  <p>{s.focus}</p>
                </li>
              ))}
            </ol>
            <p className="muted small">{intakePackage.spacing}</p>
          </div>
        </section>
        <div className="wrap">
          <IntakeForm prefill={{ parentName: name.slice(0, 200), email: email.slice(0, 200) }} />
        </div>
      </main>
      <Footer />
    </>
  );
}
