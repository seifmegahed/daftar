import SupplierCard from "./supplier-card";
import { getSuppliersBriefAction } from "@/server/actions/suppliers/read";
import type { FilterArgs } from "@/components/filter-and-search";

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

  if (error !== null) return <div>Error getting suppliers</div>;

  if (suppliers.length === 0) return <div>No suppliers found</div>;

  return (
    <div className="flex flex-col gap-4">
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </div>
  );
}

export default SuppliersList;
