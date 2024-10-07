import { listAllItemsAction } from "@/server/actions/items/read";
import { listAllSuppliersAction } from "@/server/actions/suppliers/read";
import NewItemForm from "./form";

export const dynamic = "force-dynamic";

async function NewItemPage({ params }: { params: { id: string } }) {
  const [itemsList, itemsError] = await listAllItemsAction();
  if (itemsError !== null) return <div>Error getting items</div>;

  const [suppliersList, suppliersError] = await listAllSuppliersAction();
  if (suppliersError !== null) return <div>Error getting suppliers</div>;

  return (
    <NewItemForm
      itemsList={itemsList}
      suppliersList={suppliersList}
      projectId={Number(params.id)}
    />
  );
}

export default NewItemPage;
