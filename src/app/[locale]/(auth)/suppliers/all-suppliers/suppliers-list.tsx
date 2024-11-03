import SupplierCard from "./supplier-card";
import { getSuppliersBriefAction } from "@/server/actions/suppliers/read";
import ErrorPage from "@/components/error";
import type { FilterArgs } from "@/components/filter-and-search";
import { getTranslations } from "next-intl/server";

async function SuppliersList({
  page = 1,
  query,
  filter,
}: {
  page?: number;
  query?: string;
  filter: FilterArgs;
}) {
  const t = await getTranslations("suppliers.page");

  const [suppliers, error] = await getSuppliersBriefAction(page, filter, query);
  if (error !== null) return <ErrorPage message={error} />;
  if (!suppliers.length && filter.filterType === null)
    return (
      <ErrorPage
        title={t("no-suppliers-found-error-title")}
        message={t("no-suppliers-found-error-message")}
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
