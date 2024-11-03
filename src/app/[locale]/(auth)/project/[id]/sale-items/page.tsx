import ErrorPage from "@/components/error";
import SaleItemCard from "./sale-item-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getProjectSaleItemsAction } from "@/server/actions/sale-items/read";
import { getTranslations } from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";

async function ProjectSaleItemsPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("project.sale-items-page");
  const projectId = parseInt(params.id);
  if (isNaN(projectId)) return <ErrorPage message={t("invalid-id")} />;

  const [saleItems, error] = await getProjectSaleItemsAction(projectId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!saleItems.length)
    return <ErrorPage title={t("no-items-found-error-message")} />;

  return (
    <ListPageWrapper title={t("title")} subtitle={t("subtitle")}>
      {saleItems.map((item, index) => (
        <SaleItemCard key={item.id} saleItem={item} index={index} />
      ))}
    </ListPageWrapper>
  );
}

export default ProjectSaleItemsPage;
