import { getSupplierItemsAction } from "@/server/actions/purchase-items/read";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import SupplierItemCard from "./supplier-item-card";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function SuppliersItemsPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("supplier.items");

  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message={t("invalid-id")} />;

  const [items, error] = await getSupplierItemsAction(supplierId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!items.length)
    return <ErrorPage title={t("no-items-found-error-message")} />;

  return (
    <ListPageWrapper title={t("title")} subtitle={t("subtitle")}>
      {items.map((item) => (
        <SupplierItemCard key={item.itemId} item={item} />
      ))}
    </ListPageWrapper>
  );
}

export default SuppliersItemsPage;
