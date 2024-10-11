import { listAllItemsAction } from "@/server/actions/items/read";
import NewSaleItemForm from "./form";

export const dynamic = "force-dynamic";

async function NewItemPage({ params }: { params: { id: string } }) {
  const [itemsList, itemsError] = await listAllItemsAction();
  if (itemsError !== null) return <div>Error getting items</div>;

  return (
    <NewSaleItemForm
      itemsList={itemsList}
      projectId={Number(params.id)}
    />
  );
}

export default NewItemPage;
