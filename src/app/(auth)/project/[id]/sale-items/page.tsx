import ErrorPage from "@/components/error";
import SaleItemCard from "./sale-item-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getProjectCommercialOfferItemsAction } from "@/server/actions/commercial-offer-items/read";

export const dynamic = "force-dynamic";

async function ProjectSaleItemPage({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id);
  if (isNaN(projectId)) return <ErrorPage message="Invalid project ID" />;

  const [saleItems, error] =
    await getProjectCommercialOfferItemsAction(projectId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!saleItems.length)
    return (
      <ErrorPage title="There seems to be no sale items linked to this project yet" />
    );
    
  return (
    <ListPageWrapper
      title="Project's Sale Items"
      subtitle="This is the sale items page for this project."
    >
      {saleItems.map((item, index) => (
        <SaleItemCard key={item.id} saleItem={item} index={index} />
      ))}
    </ListPageWrapper>
  );
}

export default ProjectSaleItemPage;
