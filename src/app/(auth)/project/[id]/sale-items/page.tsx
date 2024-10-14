import SaleItemCard from "./sale-item-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getProjectCommercialOfferItemsAction } from "@/server/actions/commercial-offer-items/read";

export const dynamic = "force-dynamic";

async function ProjectSaleItemPage({ params }: { params: { id: string } }) {
  const [saleItems, error] = await getProjectCommercialOfferItemsAction(
    Number(params.id),
  );
  if (error !== null) return <div>Error getting project items</div>;
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
