import InfoPageWrapper from "@/components/info-page-wrapper";

async function ClientContactsPage({ params }: { params: { id: string } }) {
  console.log(params);
  return (
    <InfoPageWrapper
      title="Client's Contacts"
      subtitle="This is a list of the client's contacts."
    >
      <div></div>
    </InfoPageWrapper>
  );
}

export default ClientContactsPage;