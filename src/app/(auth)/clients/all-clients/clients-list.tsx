import type { FilterArgs } from "@/components/filter-and-search";
import Client from "./client-card";
import { getClientsBriefAction } from "@/server/actions/clients/read";
import ErrorPage from "@/components/error";

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

  if (error !== null) return <ErrorPage message={error} />;

  if (!clients.length)
    return (
      <ErrorPage
        title="There seems to be no clients!"
        message="Start adding clients to see them here."
      />
    );

  return (
    <div className="flex flex-col gap-4">
      {clients.map((client) => (
        <Client key={client.id} client={client} />
      ))}
    </div>
  );
}

export default ClientsList;
