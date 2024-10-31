import UserInfoSection from "@/components/common-sections/user-info-section";
import InfoPageWrapper from "@/components/info-page-wrapper";
import Section from "@/components/info-section";
import { getSupplierFullByIdAction } from "@/server/actions/suppliers/read";
import SupplierSection from "@/components/common-sections/company-section";
import ErrorPage from "@/components/error";

async function SupplierPage({ params }: { params: { id: string } }) {
  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message="Invalid supplier ID" />;

  const [supplier, error] = await getSupplierFullByIdAction(supplierId);
  if (error !== null) return <ErrorPage message={error} />;
  
  return (
    <InfoPageWrapper
      title={supplier.name}
      subtitle={`This is the page for the supplier: ${supplier.name}. Here you can view all
        information about the supplier.`}
    >
      <Section title="General Info">
        <SupplierSection data={supplier} type="supplier" />
      </Section>
      <Section title="Other Info">
        <UserInfoSection data={supplier} />
      </Section>
      <Section title="Notes">
        <div>
          <p>{supplier.notes}</p>
        </div>
      </Section>
    </InfoPageWrapper>
  );
}

export default SupplierPage;
