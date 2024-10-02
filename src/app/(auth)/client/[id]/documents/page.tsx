import { getClientDocumentsAction } from "@/server/actions/documents";
import DocumentsList from "@/components/documents-list";

async function ClientDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getClientDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl">Client&apos;s Documents</h1>
      <div>
        <DocumentsList documents={documents} />
      </div>
    </div>
  );
}

export default ClientDocumentsPage;
