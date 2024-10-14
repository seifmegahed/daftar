import DocumentsList from "@/components/documents-list";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getSupplierDocumentsAction } from "@/server/actions/document-relations/read";

async function SupplierDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getSupplierDocumentsAction(
    Number(params.id),
  );
  if (error !== null) return <p>Error: {error}</p>;
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
