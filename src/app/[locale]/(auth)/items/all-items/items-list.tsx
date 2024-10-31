import { getItemsAction } from "@/server/actions/items/read";
import ItemCard from "./item-card";
import type { FilterArgs } from "@/components/filter-and-search";
import ErrorPage from "@/components/error";

async function ItemsList({
  page = 1,
  query,
  filter,
}: {
  page?: number;
  query?: string;
  filter?: FilterArgs;
}) {
  const [items, error] = await getItemsAction(page, filter, query);
  if (error !== null) return <ErrorPage message={error} />;
  if (!items.length)
    return (
      <ErrorPage
        title="There seems to be no items yet"
        message="Start adding items to be able to see them here"
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
