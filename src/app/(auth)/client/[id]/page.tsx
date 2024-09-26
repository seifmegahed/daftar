import { getClientFullByIdAction } from "@/server/actions/clients";

async function ClientPage({ params }: { params: { id: string } }) {
  const [client, error] = await getClientFullByIdAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div>
      <p>Client:</p>
      <pre>{JSON.stringify(client, null, 2)}</pre>
    </div>
  );
}

export default ClientPage;
