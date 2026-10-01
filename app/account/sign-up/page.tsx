import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header, Footer } from "@/components/SiteChrome";
import { SignUpForm } from "@/components/AccountForms";
import { getCurrentClient } from "@/lib/clients";

export const metadata: Metadata = { title: "Create your account", robots: { index: false } };
export const dynamic = "force-dynamic";

const safe = (n: string) => (n.startsWith("/") && !n.startsWith("//") ? n : "/account");

export default async function SignUp({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/account" } = await searchParams;
  if (await getCurrentClient()) redirect(safe(next));
  return (
    <>
      <Header />
      <main id="main" className="wrap page-head auth">
        <div>
          <h1>Create your account</h1>
          <p className="lede">
            Your private client space, where you can keep your weekly sleep journal and share your progress with me.
          </p>
        </div>
        <SignUpForm next={safe(next)} />
      </main>
      <Footer />
    </>
  );
}
