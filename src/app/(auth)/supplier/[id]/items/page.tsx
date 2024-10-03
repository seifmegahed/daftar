import { getSupplierItemsAction } from "@/server/actions/projects";
import InfoPageWrapper from "@/components/info-page-wrapper";

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
      {/* <div className="flex flex-col gap-4">
        {items.map((item) => (
          <SupplierItemCard
            key={item.itemId}
            item={item}
            projectId={item.projectId}
            projectName={item.projectName}
          />
        ))}
      </div> */}
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </InfoPageWrapper>
  );
}

export default SuppliersItemsPage;
