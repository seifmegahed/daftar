import { getSupplierItemsAction } from "@/server/actions/project-items/read";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import SupplierItemCard from "./supplier-item-card";

async function SuppliersItemsPage({ params }: { params: { id: string } }) {
  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message="Invalid supplier ID" />;

  const [items, error] = await getSupplierItemsAction(supplierId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!items.length)
    return (
      <ErrorPage title="There seems to be no items linked to this supplier yet" />
    );

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

export default SuppliersItemsPage;
