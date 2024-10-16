import { getDocumentClientsAction } from "@/server/actions/document-relations/read";
import ClientCard from "../../../clients/all-clients/client-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

async function DocumentClientsPage({ params }: { params: { id: string } }) {
  const documentId = parseInt(params.id);
  if (isNaN(documentId)) return <ErrorPage message="Invalid document Id" />;

  const [clients, error] = await getDocumentClientsAction(documentId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!clients.length)
    return (
      <ErrorPage title="There seems to be no clients linked to this document yet" />
    );

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
