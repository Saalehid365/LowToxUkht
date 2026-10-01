import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/SiteChrome";
import { SignInForm } from "@/components/AccountForms";
import { getCurrentClient } from "@/lib/clients";

export const metadata: Metadata = { title: "Client sign in", robots: { index: false } };
export const dynamic = "force-dynamic";

const safe = (n: string) => (n.startsWith("/") && !n.startsWith("//") ? n : "/account");

export default async function SignIn({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/account" } = await searchParams;
  if (await getCurrentClient()) redirect(safe(next));
  return (
    <>
      <Header />
      <main id="main" className="wrap page-head auth">
        <div>
          <h1>Client sign in</h1>
          <p className="lede">
            {next.startsWith("/journal")
              ? "Sign in to open your sleep journal. It's private to your account."
              : "Sign in to your private client space."}
          </p>
        </div>
        <SignInForm next={safe(next)} />
      </main>
      <Footer />
    </>
  );
}
