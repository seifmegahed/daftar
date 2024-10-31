import { getClientFullByIdAction } from "@/server/actions/clients/read";
import Section from "@/components/info-section";
import ClientSection from "@/components/common-sections/company-section";
import UserInfoSection from "@/components/common-sections/user-info-section";
import InfoPageWrapper from "@/components/info-page-wrapper";
import ErrorPage from "@/components/error";

async function ClientPage({ params }: { params: { id: string } }) {
  const clientId = parseInt(params.id);
  if (isNaN(clientId)) return <ErrorPage message="Invalid Client ID" />;

  const [client, error] = await getClientFullByIdAction(clientId);
  if (error !== null) return <ErrorPage message={error} />;
  
  return (
    <InfoPageWrapper
      title={client.name}
      subtitle={`This is the page for the client: ${client.name}. Here you can view all
        information about the client.`}
    >
      <Section title="General Info">
        <ClientSection data={client} type="client" />
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
