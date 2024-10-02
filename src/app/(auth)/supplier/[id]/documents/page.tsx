import DocumentsList from "@/components/documents-list";
import { getSupplierDocumentsAction } from "@/server/actions/documents";

async function SupplierDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getSupplierDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl">Supplier&apos;s Documents</h1>
      <div>
        <DocumentsList documents={documents} />
      </div>
    </div>
  );
}

export default SupplierDocumentsPage;
