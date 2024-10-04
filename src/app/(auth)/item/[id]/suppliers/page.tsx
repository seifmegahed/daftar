import InfoPageWrapper from "@/components/info-page-wrapper";
import { getItemSuppliersAction } from "@/server/actions/project-items/read";
import SupplierCard from "@/app/(auth)/suppliers/all-suppliers/supplier-card";

async function ItemSuppliersPage({ params }: { params: { id: string } }) {
  const itemId = Number(params.id);
  if (isNaN(itemId)) return <p>Error: Item ID is not a number</p>;

  const [suppliers, error] = await getItemSuppliersAction(itemId);
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <InfoPageWrapper
      title="Item's Suppliers"
      subtitle="This is a list of the suppliers that supplied this item."
    >
      <div className="flex flex-col gap-4">
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </InfoPageWrapper>
  );
}

export default ItemSuppliersPage;
