import type { Metadata } from "next";
import { Header, Footer } from "@/components/SiteChrome";
import { Steps, FaqSection, CtaBand } from "@/components/Sections";

export const metadata: Metadata = {
  title: "How it works",
  description: "Private wellness sessions from home, by phone, WhatsApp or video, with a written plan and gentle follow ups.",
};

export default function HowItWorks() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="page-head wrap">
          <h1>How it works</h1>
          <p className="lede">
            Private, one to one sessions from your own home. You get a clear, gentle plan and support while the changes
            settle in, without throwing everything out or spending a fortune.
          </p>
        </section>
        <Steps />
        <FaqSection />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
