import { getItemDocumentsAction } from "@/server/actions/documents";

async function ClientDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getItemDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div>
      <p>Item Documents:</p>
      <pre>{JSON.stringify(documents, null, 2)}</pre>
    </div>
  );
}

export default ClientDocumentsPage;
