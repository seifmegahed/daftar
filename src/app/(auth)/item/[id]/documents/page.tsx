import DocumentsList from "@/components/documents-list";
import { getItemDocumentsAction } from "@/server/actions/documents";

async function ClientDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getItemDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl">Item&apos;s Documents</h1>
      <div>
        <DocumentsList documents={documents} />
      </div>
    </div>
  );
}

export default ClientDocumentsPage;
