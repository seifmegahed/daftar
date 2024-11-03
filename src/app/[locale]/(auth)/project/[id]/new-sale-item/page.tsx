import { listAllItemsAction } from "@/server/actions/items/read";
import NewSaleItemForm from "./form";
import ErrorPage from "@/components/error";
import { getTranslations } from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";
import type { LocaleParams } from "@/i18n/set-locale";

async function NewItemPage({
  params,
}: {
  params: { id: string; locale: LocaleParams["locale"] };
}) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("project.new-sale-item-page");
  const projectId = parseInt(params.id);
  if (isNaN(projectId)) return <ErrorPage message={t("invalid-id")} />;

  const [itemsList, itemsError] = await listAllItemsAction();
  if (itemsError !== null) return <ErrorPage message={itemsError} />;
  if (!itemsList.length)
    return (
      <ErrorPage
        title={t("no-items-found-error-title")}
        message={t("no-items-found-error-message")}
      />
    );

  return <NewSaleItemForm itemsList={itemsList} projectId={projectId} />;
}

export default NewItemPage;
