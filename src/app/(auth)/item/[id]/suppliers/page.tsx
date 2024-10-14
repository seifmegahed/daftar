import { getItemSuppliersAction } from "@/server/actions/project-items/read";
import SupplierCard from "@/app/(auth)/suppliers/all-suppliers/supplier-card";
import ListPageWrapper from "@/components/list-page-wrapper";

async function ItemSuppliersPage({ params }: { params: { id: string } }) {
  const itemId = Number(params.id);
  if (isNaN(itemId)) return <p>Error: Item ID is not a number</p>;

  const [suppliers, error] = await getItemSuppliersAction(itemId);
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <ListPageWrapper
      title="Item's Suppliers"
      subtitle="This is a list of the suppliers that supplied this item."
    >
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </ListPageWrapper>
  );
}

export default ItemSuppliersPage;
