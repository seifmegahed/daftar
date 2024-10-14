import { getSupplierItemsAction } from "@/server/actions/project-items/read";
import type { SupplierItemType } from "@/server/db/tables/project-item/queries";
import { numberWithCommas } from "@/utils/common";
import Link from "next/link";
import ListPageWrapper from "@/components/list-page-wrapper";
import CardWrapper from "@/components/card-wrapper";

async function SuppliersItemsPage({ params }: { params: { id: string } }) {
  const supplierId = Number(params.id);

  if (isNaN(supplierId)) return <p>Error: Supplier ID is not a number</p>;

  const [items, error] = await getSupplierItemsAction(supplierId);
  if (error !== null) return <p>Error: {error}</p>;

  return (
    <ListPageWrapper
      title="Supplier's Items"
      subtitle="This is a list of the supplier's items."
    >
      {items.map((item) => (
        <SupplierItemCard key={item.itemId} item={item} />
      ))}
    </ListPageWrapper>
  );
}

const SupplierItemCard = ({ item }: { item: SupplierItemType }) => {
  return (
    <CardWrapper>
      <Link href={`/item/${item.itemId}`} className="hidden sm:block">
        <div className="flex cursor-pointer items-center justify-center">
          <p className="w-10 text-center text-2xl font-bold text-foreground">
            {item.itemId}
          </p>
        </div>
      </Link>
      <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
        <div>
          <Link href={`/item/${item.itemId}`}>
            <p className="cursor-pointer text-lg font-bold text-foreground hover:underline">
              {item.itemName}
            </p>
          </Link>
          <p className="cursor-pointer text-xs text-muted-foreground">
            {item.itemMake}
          </p>
        </div>
        <div className="sm:w-72 sm:text-end">
          <Link href={`/project/${item.projectId}`}>
            <p className="line-clamp-1 text-foreground hover:underline">
              {item.projectName}
            </p>
          </Link>
          <div className="flex gap-4 sm:justify-end">
            <p className="text-xs text-muted-foreground">
              {"Quantity: " + item.quantity}
            </p>
            <p className="min-w-24 text-xs text-muted-foreground">
              {"Price: " + numberWithCommas(Number(item.price))}
            </p>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export default SuppliersItemsPage;
