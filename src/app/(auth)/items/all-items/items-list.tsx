import { getItemsAction } from "@/server/actions/items/read";
import ItemCard from "./item-card";
import type { FilterArgs } from "@/components/filter-and-search";

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

  if (error !== null) return <div>Error getting items</div>;

  if (items.length === 0) return <div>No items found</div>;

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default ItemsList;
