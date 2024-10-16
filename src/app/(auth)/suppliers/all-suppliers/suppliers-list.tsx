import SupplierCard from "./supplier-card";
import { getSuppliersBriefAction } from "@/server/actions/suppliers/read";
import type { FilterArgs } from "@/components/filter-and-search";
import ErrorPage from "@/components/error";

async function SuppliersList({
  page = 1,
  query,
  filter,
}: {
  page?: number;
  query?: string;
  filter?: FilterArgs;
}) {
  const [suppliers, error] = await getSuppliersBriefAction(page, filter, query);
  if (error !== null) return <ErrorPage message={error} />;
  if (!suppliers.length)
    return (
      <ErrorPage
        title="There seems to be no suppliers yet"
        message="Start adding suppliers to be able to see them here"
      />
    );

  return (
    <div className="flex flex-col gap-4">
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </div>
  );
}

export default SuppliersList;
