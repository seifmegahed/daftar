import { getClientDocumentsAction } from "@/server/actions/documents";

async function ClientDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getClientDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div>
      <p>Client Documents:</p>
      <pre>{JSON.stringify(documents, null, 2)}</pre>
    </div>
  );
}

export default ClientDocumentsPage;
