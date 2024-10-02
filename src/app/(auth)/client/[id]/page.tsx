import { getClientFullByIdAction } from "@/server/actions/clients";
import { Separator } from "@/components/ui/separator";
import Section from "@/components/info-section";
import ClientSection from "@/components/common/client-section";
import UserInfoSection from "@/components/common/user-info-section";

async function ClientPage({ params }: { params: { id: string } }) {
  const [client, error] = await getClientFullByIdAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
      <Separator />
      <p className="text-muted-foreground">
        This is the page for the client: {client.name}. Here you can view all
        information about the client.
      </p>
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
    </div>
  );
}

export default ClientPage;
