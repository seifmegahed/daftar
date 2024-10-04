import { getDocumentSuppliersAction } from "@/server/actions/document-relations/read";
import InfoPageWrapper from "@/components/info-page-wrapper";
import SupplierCard from "../../../suppliers/all-suppliers/supplier-card";

async function DocumentSuppliersPage({ params }: { params: { id: string } }) {
  const documentId = Number(params.id);
  if (isNaN(documentId)) return <p>Error: Document ID is not a number</p>;

  const [suppliers, error] = await getDocumentSuppliersAction(documentId);
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <InfoPageWrapper
      title="Document's Suppliers"
      subtitle="This is a list of the suppliers that reference this document."
    >
      <div className="flex flex-col gap-4">
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>
    </InfoPageWrapper>
  );
}

export default DocumentSuppliersPage;
