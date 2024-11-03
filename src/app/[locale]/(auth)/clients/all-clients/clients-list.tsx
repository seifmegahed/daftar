import type { FilterArgs } from "@/components/filter-and-search";
import Client from "./client-card";
import { getClientsBriefAction } from "@/server/actions/clients/read";
import ErrorPage from "@/components/error";
import { getTranslations } from "next-intl/server";

async function ClientsList({
  page = 1,
  query,
  filter,
}: {
  page: number;
  query?: string;
  filter: FilterArgs;
}) {
  const t = await getTranslations("clients.page");

  const [clients, error] = await getClientsBriefAction(page, filter, query);
  if (error !== null) return <ErrorPage message={error} />;
  if (!clients.length && filter.filterType === null)
    return (
      <ErrorPage
        title={t("no-clients-error-title")}
        message={t("no-clients-error-description")}
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
