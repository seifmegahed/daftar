import type { FilterArgs } from "@/components/filter-and-search";
import Client from "./client-card";
import { getClientsBriefAction } from "@/server/actions/clients/read";

async function ClientsList({
  page = 1,
  query,
  filter,
}: {
  page?: number;
  query?: string;
  filter?: FilterArgs;
}) {
  const [clients, error] = await getClientsBriefAction(page, filter, query);

  if (error !== null) return <div>Error getting clients</div>;

  if (clients.length === 0) return <div>No clients found</div>;

  return (
    <div className="flex flex-col gap-4">
      {clients.map((client) => (
        <Client key={client.id} client={client} />
      ))}
    </div>
  );
}

export default ClientsList;
