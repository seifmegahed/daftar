import { getSupplierItemsAction } from "@/server/actions/project-items/read";
import type { SupplierItemType } from "@/server/db/tables/project-item/queries";
import InfoPageWrapper from "@/components/info-page-wrapper";
import { numberWithCommas } from "@/utils/common";
import Link from "next/link";

async function SuppliersItemsPage({ params }: { params: { id: string } }) {
  const supplierId = Number(params.id);

  if (isNaN(supplierId)) return <p>Error: Supplier ID is not a number</p>;

  const [items, error] = await getSupplierItemsAction(supplierId);
  if (error !== null) return <p>Error: {error}</p>;

  return (
    <InfoPageWrapper
      title="Supplier's Items"
      subtitle="This is a list of the supplier's items."
    >
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <SupplierItemCard key={item.itemId} item={item} />
        ))}
      </div>
    </InfoPageWrapper>
  );
}

const SupplierItemCard = ({ item }: { item: SupplierItemType }) => {
  return (
    <div className="flex items-center gap-5 rounded-xl border p-4">
      <Link href={`/item/${item.itemId}`}>
        <div className="flex cursor-pointer items-center justify-center">
          <p className="w-10 text-right text-2xl font-bold text-foreground">
            {item.itemId}
          </p>
        </div>
      </Link>
      <div className="flex w-full items-center justify-between">
        <div>
          <Link href={`/item/${item.itemId}`}>
            <p className="cursor-pointer text-foreground hover:underline">
              {item.itemName}
            </p>
          </Link>
          <p className="cursor-pointer text-xs text-muted-foreground">
            {item.itemMake}
          </p>
        </div>
        <div className="w-72 text-right">
          <Link href={`/project/${item.projectId}`}>
            <p className="line-clamp-1 text-foreground hover:underline">
              {item.projectName}
            </p>
          </Link>
          <div className="flex justify-end gap-4">
            <p className="text-xs text-muted-foreground">
              {"Quantity: " + item.quantity}
            </p>
            <p className="text-xs text-muted-foreground min-w-24">
              {"Price: " + numberWithCommas(Number(item.price))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersItemsPage;
