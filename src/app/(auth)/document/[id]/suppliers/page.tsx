import { getDocumentSuppliersAction } from "@/server/actions/document-relations/read";
import SupplierCard from "../../../suppliers/all-suppliers/supplier-card";
import ListPageWrapper from "@/components/list-page-wrapper";

async function DocumentSuppliersPage({ params }: { params: { id: string } }) {
  const documentId = Number(params.id);
  if (isNaN(documentId)) return <p>Error: Document ID is not a number</p>;

  const [suppliers, error] = await getDocumentSuppliersAction(documentId);
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <ListPageWrapper
      title="Document's Suppliers"
      subtitle="This is a list of the suppliers that reference this document."
    >
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </ListPageWrapper>
  );
}

export default DocumentSuppliersPage;
