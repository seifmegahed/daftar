import { listAllItemsAction } from "@/server/actions/items/read";
import NewSaleItemForm from "./form";
import ErrorPage from "@/components/error";

async function NewItemPage({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id);
  if (isNaN(projectId)) return <ErrorPage message="Invalid project ID" />;

  const [itemsList, itemsError] = await listAllItemsAction();
  if (itemsError !== null) return <ErrorPage message={itemsError} />;
  if (!itemsList.length) return <ErrorPage title="You have no items yet" message="Add items to be able to add sale items." />;

  return (
    <NewSaleItemForm
      itemsList={itemsList}
      projectId={projectId}
    />
  );
}

export default NewItemPage;
