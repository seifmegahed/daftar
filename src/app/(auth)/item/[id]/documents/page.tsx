import DocumentsList from "@/components/documents-list";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getItemDocumentsAction } from "@/server/actions/document-relations/read";

async function ClientDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getItemDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <ListPageWrapper
      title="Item's Documents"
      subtitle="This is a list of the documents linked to the item."
    >
      <DocumentsList documents={documents} />
    </ListPageWrapper>
  );
}

export default ClientDocumentsPage;
