import UserInfoSection from "@/components/common-sections/user-info-section";
import ErrorPage from "@/components/error";
import InfoPageWrapper from "@/components/info-page-wrapper";
import Section from "@/components/info-section";
import { getItemDetailsAction } from "@/server/actions/items/read";

async function ItemPage({ params }: { params: { id: string } }) {
  const itemId = parseInt(params.id);
  if (isNaN(itemId)) return <ErrorPage message="Invalid document Id" />;

  const [item, error] = await getItemDetailsAction(itemId);
  if (error !== null) return <ErrorPage message={error} />;
  
  return (
    <InfoPageWrapper
      title="Item Details"
      subtitle={`This is the page for the item: ${item.name}. Here you can view all information about the item.`}
    >
      <Section title="General Info">
        <ItemGeneralInfoSection item={item} />
      </Section>
      <Section title="Other Info">
        <UserInfoSection data={item} />
      </Section>
      <Section title="Notes">
        <div>
          <p>{item.notes}</p>
        </div>
      </Section>
    </InfoPageWrapper>
  );
}

const ItemGeneralInfoSection = ({
  item,
}: {
  item: {
    name: string;
    type: string | null;
    description: string | null;
    mpn: string | null;
    make: string | null;
  };
}) => (
  <>
    <div className="flex justify-between">
      <p>Name</p>
      <p>{item.name}</p>
    </div>
    <div className="flex justify-between">
      <p>Type</p>
      <p>{item.type}</p>
    </div>
    <div className="flex justify-between">
      <p>Description</p>
      <p>{item.description}</p>
    </div>
    <div className="flex justify-between">
      <p>MPN</p>
      <p>{item.mpn}</p>
    </div>
    <div className="flex justify-between">
      <p>Make</p>
      <p>{item.make}</p>
    </div>
  </>
);

export default ItemPage;
