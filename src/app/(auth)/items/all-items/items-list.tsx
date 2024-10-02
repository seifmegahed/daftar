import { getItemsAction } from "@/server/actions/items";
import ItemCard from "./item-card";

async function ItemsList({
  page = 1,
  query,
}: {
  page?: number;
  query?: string;
}) {
  const [items, error] = await getItemsAction(page, query);

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
