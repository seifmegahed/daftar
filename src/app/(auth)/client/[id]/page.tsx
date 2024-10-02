import { getClientFullByIdAction } from "@/server/actions/clients";
import Section from "@/components/info-section";
import ClientSection from "@/components/common-sections/client-section";
import UserInfoSection from "@/components/common-sections/user-info-section";
import InfoPageWrapper from "@/components/info-page-wrapper";

async function ClientPage({ params }: { params: { id: string } }) {
  const [client, error] = await getClientFullByIdAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <InfoPageWrapper
      title={client.name}
      subtitle={`This is the page for the client: ${client.name}. Here you can view all
        information about the client.`}
    >
      <Section title="General Info">
        <ClientSection client={client} />
      </Section>
      <Section title="Other Info">
        <UserInfoSection data={client} />
      </Section>
      <Section title="Notes">
        <div>
          <p>{client.notes}</p>
        </div>
      </Section>
    </InfoPageWrapper>
  );
}

export default ClientPage;
