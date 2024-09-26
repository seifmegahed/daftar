import { getAllSuppliersBriefAction } from "@/server/actions/suppliers";
import Link from "next/link";

async function AllSuppliersPage() {
  const [suppliers, error] = await getAllSuppliersBriefAction();
  if (error !== null) return <div>Error getting suppliers</div>;
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Suppliers Page</h3>
      <p className="text-sm text-muted-foreground">
        List of all suppliers in the database.
      </p>
      <div className="flex flex-col gap-2">
        {suppliers.map((supplier) => (
          <Link key={supplier.id} href={`/supplier/${supplier.id}`}>
            <div className="flex cursor-pointer items-center gap-2 rounded-md border p-3 hover:bg-muted">
              <div className="flex-1 text-sm text-muted-foreground">
                {supplier.name}
              </div>
              <div className="flex-1 text-sm text-muted-foreground">
                {supplier.registrationNumber}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllSuppliersPage;
