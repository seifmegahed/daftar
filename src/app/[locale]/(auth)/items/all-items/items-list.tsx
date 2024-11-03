import { getItemsAction } from "@/server/actions/items/read";
import ItemCard from "./item-card";
import ErrorPage from "@/components/error";
import { getTranslations } from "next-intl/server";

import type { FilterArgs } from "@/components/filter-and-search";

async function ItemsList({
  page = 1,
  query,
  filter,
}: {
  page?: number;
  query?: string;
  filter: FilterArgs;
}) {
  const t = await getTranslations("items.page");

  const [items, error] = await getItemsAction(page, filter, query);
  if (error !== null) return <ErrorPage message={error} />;
  if (!items.length && filter.filterType === null)
    return (
      <ErrorPage
        title={t("no-items-found-error-title")}
        message={t("no-items-found-error-message")}
      />
    );

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default ItemsList;
