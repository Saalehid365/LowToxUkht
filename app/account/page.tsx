import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/SiteChrome";
import { getCurrentClient } from "@/lib/clients";
import { site } from "@/lib/site";
import { signOut } from "./actions";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Account() {
  const client = await getCurrentClient();
  if (!client) redirect("/account/sign-in");

  return (
    <>
      <Header />
      <main id="main" className="wrap page-head account">
        <h1>Assalamu alaikum, {client.name.split(" ")[0]}.</h1>
        <div className="account-head">
          <p className="lede">This is your private client space.</p>
          <form action={signOut}>
            <button className="link">Sign out</button>
          </form>
        </div>

        <section className="panel account-card" aria-labelledby="journal-heading">
          <h2 id="journal-heading">Sleep journal</h2>
          <p>
            Tap through a few questions each morning about last night&rsquo;s sleep. It takes about a minute, and your
            progress page shows what seems to help, week by week.
          </p>
          <Link className="btn" href="/journal">
            Open my sleep journal
          </Link>
        </section>

        <section className="account-details" aria-label="Your details">
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{client.email}</dd>
            </div>
            {client.phone && (
              <div>
                <dt>Phone</dt>
                <dd>{client.phone}</dd>
              </div>
            )}
            <div>
              <dt>Need anything?</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}
