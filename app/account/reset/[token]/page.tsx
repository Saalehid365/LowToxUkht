import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";
import { ResetForm } from "@/components/AccountForms";
import { findClientByResetToken } from "@/lib/clients";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Reset({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const client = await findClientByResetToken(token);
  return (
    <>
      <Header />
      <main id="main" className="wrap page-head auth">
        <div>
          <h1>Choose a new password</h1>
          <p className="lede">
            {client ? `For ${client.email}. You'll be signed in once it's saved.` : "This reset link has expired or already been used."}
          </p>
          {!client && (
            <p>
              <Link href="/contact">Message me</Link> for a new link.
            </p>
          )}
        </div>
        {client && <ResetForm token={token} />}
      </main>
      <Footer />
    </>
  );
}
