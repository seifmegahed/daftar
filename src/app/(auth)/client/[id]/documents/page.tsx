import { getClientDocumentsAction } from "@/server/actions/document-relations/read";
import DocumentsList from "@/components/documents-list";
import ListPageWrapper from "@/components/list-page-wrapper";

async function ClientDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getClientDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
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
