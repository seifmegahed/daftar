import { listAllItemsAction } from "@/server/actions/items/read";
import { listAllSuppliersAction } from "@/server/actions/suppliers/read";
import NewItemForm from "./form";
import ErrorPage from "@/components/error";
import { getTranslations } from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";
import type { LocaleParams } from "@/i18n/set-locale";

async function NewItemPage({ params }: { params: { id: string, locale: LocaleParams["locale"] } }) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("project.new-purchase-item-page");
  const [itemsList, itemsError] = await listAllItemsAction();
  const id = parseInt(params.id);
  if (isNaN(id)) return <ErrorPage message={t("invalid-id")} />;

  if (itemsError !== null) return <ErrorPage message={itemsError} />;
  if (!itemsList.length)
    return (
      <ErrorPage
        title={t("no-items-found-error-title")}
        message={t("no-items-found-error-message")}
      />
    );

  const [suppliersList, suppliersError] = await listAllSuppliersAction();
  if (suppliersError !== null) return <ErrorPage message={suppliersError} />;
  if (!suppliersList.length)
    return (
      <ErrorPage
        title={t("no-suppliers-found-error-title")}
        message={t("no-suppliers-found-error-message")}
      />
    );

  return (
    <NewItemForm
      itemsList={itemsList}
      suppliersList={suppliersList}
      projectId={id}
    />
  );
}

export default NewItemPage;
