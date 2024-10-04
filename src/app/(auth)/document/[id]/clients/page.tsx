import { getDocumentClientsAction } from "@/server/actions/document-relations/read";
import ClientCard from "../../../clients/all-clients/client-card";
import InfoPageWrapper from "@/components/info-page-wrapper";

async function DocumentClientsPage({ params }: { params: { id: string } }) {
  const documentId = Number(params.id);
  if (isNaN(documentId)) return <p>Error: Document ID is not a number</p>;

  const [clients, error] = await getDocumentClientsAction(documentId);
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <InfoPageWrapper
      title="Document's Clients"
      subtitle="This is a list of the clients that reference this document."
    >
      <div className="flex flex-col gap-4">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </InfoPageWrapper>
  );
}

export default DocumentClientsPage;
