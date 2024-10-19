import { listAllItemsAction } from "@/server/actions/items/read";
import { listAllSuppliersAction } from "@/server/actions/suppliers/read";
import NewItemForm from "./form";
import ErrorPage from "@/components/error";

async function NewItemPage({ params }: { params: { id: string } }) {
  const [itemsList, itemsError] = await listAllItemsAction();
  if (itemsError !== null) return <ErrorPage message={itemsError} />;
  if (!itemsList.length)
    return (
      <ErrorPage
        title="You have no items yet"
        message="Add items to be able to add purchase items."
      />
    );

  const [suppliersList, suppliersError] = await listAllSuppliersAction();
  if (suppliersError !== null) return <ErrorPage message={suppliersError} />;
  if (!suppliersList.length)
    return (
      <ErrorPage
        title="You have no suppliers yet"
        message="Add suppliers to be able to add purchase items."
      />
    );

  return (
    <NewItemForm
      itemsList={itemsList}
      suppliersList={suppliersList}
      projectId={Number(params.id)}
    />
  );
}

export default NewItemPage;
