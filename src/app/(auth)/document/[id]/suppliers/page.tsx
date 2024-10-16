import { getDocumentSuppliersAction } from "@/server/actions/document-relations/read";
import SupplierCard from "../../../suppliers/all-suppliers/supplier-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

async function DocumentSuppliersPage({ params }: { params: { id: string } }) {
  const documentId = parseInt(params.id);
  if (isNaN(documentId)) return <ErrorPage message="Invalid document Id" />;

  const [suppliers, error] = await getDocumentSuppliersAction(documentId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!suppliers.length)
    return (
      <ErrorPage title="There seems to be no suppliers linked to this document yet" />
    );

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
