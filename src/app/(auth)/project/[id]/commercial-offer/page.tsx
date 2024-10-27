import ErrorPage from "@/components/error";
import { getProjectByIdAction } from "@/server/actions/projects/read";
import { getProjectSaleItemsAction } from "@/server/actions/sale-items/read";
import { hasAccessToPrivateDataAction } from "@/server/actions/users";
import GenerateOfferForm from "./form";

async function CommercialOffer({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) return <ErrorPage message="Invalid project ID" />;

  const [access] = await hasAccessToPrivateDataAction();
  if (!access)
    return <ErrorPage message="You are not authorized to view this page" />;

  const [project, error] = await getProjectByIdAction(id);
  if (error !== null) return <ErrorPage message={error} />;

  const [saleItems, salesItemsError] = await getProjectSaleItemsAction(id);
  if (salesItemsError !== null) return <ErrorPage message={salesItemsError} />;

  if (saleItems.length === 0) return <ErrorPage message="No items found" />;

  return <GenerateOfferForm project={project} saleItems={saleItems} />;
}

export default CommercialOffer;
