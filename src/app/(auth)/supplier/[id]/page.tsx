import { getSupplierFullByIdAction } from "@/server/actions/suppliers";

async function SupplierPage({ params }: { params: { id: string } }) {
  const [supplier, error] = await getSupplierFullByIdAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div>
      <p>Supplier:</p>
      <pre>{JSON.stringify(supplier, null, 2)}</pre>
    </div>
  );
}

export default SupplierPage;
