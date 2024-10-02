import InfoPageWrapper from "@/components/info-page-wrapper";

async function ClientAddressesPage({ params }: { params: { id: string } }) {
  console.log(params);
  return (
    <InfoPageWrapper
      title="Client's Addresses"
      subtitle="This is a list of the client's addresses."
    >
      <div></div>
    </InfoPageWrapper>
  );
}

export default ClientAddressesPage;
