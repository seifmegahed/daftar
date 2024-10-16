import DocumentsList from "@/components/documents-list";
import ErrorPage from "@/components/error";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getSupplierDocumentsAction } from "@/server/actions/document-relations/read";

async function SupplierDocumentsPage({ params }: { params: { id: string } }) {
  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message="Invalid supplier ID" />;

  const [documents, error] = await getSupplierDocumentsAction(supplierId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!documents.length)
    return (
      <ErrorPage title="There seems to be no documents linked to this supplier yet" />
    );

  return (
    <ListPageWrapper
      title="Supplier's Documents"
      subtitle="This is a list of the documents linked to the supplier."
    >
      <div>
        <DocumentsList documents={documents} />
      </div>
    </ListPageWrapper>
  );
}

export default SupplierDocumentsPage;
