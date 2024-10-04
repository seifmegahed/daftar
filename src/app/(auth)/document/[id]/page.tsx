import { getDocumentByIdAction } from "@/server/actions/documents";

async function ItemPage({ params }: { params: { id: string } }) {
  const [client, error] = await getDocumentByIdAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div>
      <p>Document:</p>
      <pre>{JSON.stringify(client, null, 2)}</pre>
    </div>
  );
}

export default ItemPage;
