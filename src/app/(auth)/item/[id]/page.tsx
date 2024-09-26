import { getItemDetailsAction } from "@/server/actions/items";

async function ItemPage({ params }: { params: { id: string } }) {
  const [client, error] = await getItemDetailsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div>
      <p>Item:</p>
      <pre>{JSON.stringify(client, null, 2)}</pre>
    </div>
  );
}

export default ItemPage;
