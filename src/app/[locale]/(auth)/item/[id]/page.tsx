import UserInfoSection from "@/components/common-sections/user-info-section";
import DataDisplayUnit from "@/components/data-display-unit";
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
    <DataDisplayUnit label="Name" values={[item.name]} />
    <DataDisplayUnit label="Type" values={[item.type]} />
    <DataDisplayUnit label="Description" values={[item.description]} />
    <DataDisplayUnit label="MPN" values={[item.mpn]} />
    <DataDisplayUnit label="Make" values={[item.make]} />
  </>
);

export default ItemPage;
