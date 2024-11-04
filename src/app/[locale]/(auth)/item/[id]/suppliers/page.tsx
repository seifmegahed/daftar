import { getItemSuppliersAction } from "@/server/actions/purchase-items/read";
import SupplierCard from "@/app/[locale]/(auth)/suppliers/all-suppliers/supplier-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function ItemSuppliersPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("item.suppliers");

  const itemId = parseInt(params.id);
  if (isNaN(itemId)) return <ErrorPage message={t("invalid-id")} />;

  const [suppliers, error] = await getItemSuppliersAction(itemId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!suppliers.length)
    return <ErrorPage title={t("no-suppliers-found-error-message")} />;

  return (
    <ListPageWrapper title={t("title")} subtitle={t("subtitle")}>
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </ListPageWrapper>
  );
}

export default ItemSuppliersPage;
