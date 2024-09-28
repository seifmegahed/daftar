import { getAllClientsBriefAction } from "@/server/actions/clients";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function AllClientsPage() {
  const [clients, error] = await getAllClientsBriefAction();
  if (error !== null) return <div>Error getting clients</div>;
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Clients Page</h3>
      <p className="text-sm text-muted-foreground">
        List of all clients in the database.
      </p>
      <div className="flex flex-col gap-2">
        {clients.map((client) => (
          <Link key={client.id} href={`/client/${client.id}`}>
            <div
              className="flex cursor-pointer items-center gap-2 rounded-md border p-3 hover:bg-muted"
            >
              <div className="flex-1 text-sm text-muted-foreground">
                {client.name}
              </div>
              <div className="flex-1 text-sm text-muted-foreground">
                {client.registrationNumber}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllClientsPage;
