import { getClientDocumentsAction } from "@/server/actions/document-relations/read";
import DocumentsList from "@/components/documents-list";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

async function ClientDocumentsPage({ params }: { params: { id: string } }) {
  const clientId = parseInt(params.id);
  if (isNaN(clientId)) return <ErrorPage message="Invalid Client ID" />;

  const [documents, error] = await getClientDocumentsAction(clientId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!documents.length)
    return (
      <ErrorPage title="There seems to be no documents linked to this client yet" />
    );

  return (
    <ListPageWrapper
      title="Client's Documents"
      subtitle="This is a list of the documents linked to the client."
    >
      <DocumentsList documents={documents} />
    </ListPageWrapper>
  );
}

export default ClientDocumentsPage;
