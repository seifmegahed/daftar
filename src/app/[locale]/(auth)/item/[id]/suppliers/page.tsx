import { getItemSuppliersAction } from "@/server/actions/purchase-items/read";
import SupplierCard from "@/app/[locale]/(auth)/suppliers/all-suppliers/supplier-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

async function ItemSuppliersPage({ params }: { params: { id: string } }) {
  const itemId = parseInt(params.id);
  if (isNaN(itemId)) return <ErrorPage message="Invalid item ID" />;

  const [suppliers, error] = await getItemSuppliersAction(itemId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!suppliers.length)
    return (
      <ErrorPage title="There seems to be no suppliers linked to this item yet" />
    );

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
