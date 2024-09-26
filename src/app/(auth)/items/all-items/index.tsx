import { getAllItemsBriefAction } from "@/server/actions/items";
import Link from "next/link";

async function AllItemsPage() {
  const [items, error] = await getAllItemsBriefAction();
  if (error !== null) return <div>Error getting items</div>;
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Items Page</h3>
      <p className="text-sm text-muted-foreground">
        List of all items.
      </p>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <Link key={item.id} href={`/item/${item.id}`}>
            <div
              className="flex cursor-pointer items-center gap-2 rounded-md border p-3 hover:bg-muted"
            >
              <div className="flex-1 text-sm text-muted-foreground">
                {item.name}
              </div>
              <div className="flex-1 text-sm text-muted-foreground">
                {item.make}
              </div>
              <div className="flex-1 text-sm text-muted-foreground">
                {item.type}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllItemsPage;
