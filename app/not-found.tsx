import Link from "next/link";
import { Header, Footer } from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="wrap page-head not-found">
        <h1>This page isn&rsquo;t here.</h1>
        <p className="lede">The link may be old, or the page may have moved. Everything you need is one step away.</p>
        <div className="actions">
          <Link href="/" className="btn">
            Go to the home page
          </Link>
          <Link href="/consultations" className="link">
            See consultations
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
