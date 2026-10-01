import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import { SleepJournal } from "@/components/SleepJournal";
import { getCurrentClient } from "@/lib/clients";
import { getEntries } from "@/lib/journal-db";
import { site } from "@/lib/site";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["600", "700"], style: ["normal", "italic"], variable: "--font-sj-serif" });
const sans = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-sj-sans" });

export const metadata: Metadata = { title: "Sleep Journal", robots: { index: false } };
export const viewport: Viewport = { themeColor: "#B66A7E", viewportFit: "cover" };
export const dynamic = "force-dynamic";

export default async function Journal() {
  const client = await getCurrentClient();
  if (!client) redirect("/account/sign-in?next=/journal");

  const entries = await getEntries(client.id);
  return (
    <div className={`${serif.variable} ${sans.variable}`}>
      <SleepJournal initialEntries={entries} initialName={client.child_name} brand={site.name} />
    </div>
  );
}
