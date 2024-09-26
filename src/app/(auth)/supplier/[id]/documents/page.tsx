import { getSupplierDocumentsAction } from "@/server/actions/documents";

async function SupplierDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getSupplierDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div>
      <p>Supplier Documents:</p>
      <pre>{JSON.stringify(documents, null, 2)}</pre>
    </div>
  );
}

export default SupplierDocumentsPage;
