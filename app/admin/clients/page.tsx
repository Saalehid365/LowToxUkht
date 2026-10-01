import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listClients, type ClientSummary } from "@/lib/clients";
import { AdminBar } from "@/components/AdminBar";
import { ClientsTable } from "@/components/ClientsTable";

export const metadata: Metadata = { title: "Clients", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Clients() {
  if (!(await isAdmin())) redirect("/admin/login");

  let clients: ClientSummary[] = [];
  let loadError = "";
  try {
    clients = await listClients();
  } catch (err) {
    console.error(err);
    loadError = "Client accounts could not be loaded. Check that DATABASE_URL is your Neon connection string.";
  }

  return (
    <div className="admin">
      <AdminBar current="clients" />
      <main className="wrap admin-main">
        <h1>Clients</h1>
        <p className="muted admin-lede">
          Clients create their own account from <strong>Client login</strong> on the website, then keep their sleep
          journal there. Open a client to see their nights.
        </p>
        {loadError && (
          <p className="form-error" role="alert">
            {loadError}
          </p>
        )}
        <ClientsTable clients={clients} />
      </main>
    </div>
  );
}
