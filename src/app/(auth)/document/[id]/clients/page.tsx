import { getDocumentClientsAction } from "@/server/actions/document-relations/read";
import ClientCard from "../../../clients/all-clients/client-card";
import ListPageWrapper from "@/components/list-page-wrapper";

async function DocumentClientsPage({ params }: { params: { id: string } }) {
  const documentId = Number(params.id);
  if (isNaN(documentId)) return <p>Error: Document ID is not a number</p>;

  const [clients, error] = await getDocumentClientsAction(documentId);
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <ListPageWrapper
      title="Document's Clients"
      subtitle="This is a list of the clients that reference this document."
    >
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
    </ListPageWrapper>
  );
}

export default DocumentClientsPage;
