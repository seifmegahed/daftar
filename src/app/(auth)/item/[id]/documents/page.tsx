import DocumentsList from "@/components/documents-list";
import ErrorPage from "@/components/error";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getItemDocumentsAction } from "@/server/actions/document-relations/read";

async function ClientDocumentsPage({ params }: { params: { id: string } }) {
  const itemId = parseInt(params.id);
  if (isNaN(itemId)) return <ErrorPage message="Invalid item Id" />;

  const [documents, error] = await getItemDocumentsAction(itemId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!documents.length)
    return (
      <ErrorPage title="There seems to be no document linked to this item yet" />
    );

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
