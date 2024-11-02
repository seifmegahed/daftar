import { getPurchaseItemsAction } from "@/server/actions/purchase-items/read";
import PurchaseItem from "./project-item-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";
import type { LocaleParams } from "@/i18n/set-locale";

async function ProjectItemsPage({ params }: { params: { id: string; locale:  LocaleParams["locale"] } }) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("project.purchase-items-page");
  const projectId = parseInt(params.id);
  if (isNaN(projectId)) return <ErrorPage message={t("invalid-id")} />;

  const [projectItems, error] = await getPurchaseItemsAction(projectId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!projectItems.length)
    return (
      <ErrorPage title={t("no-items-found-error-message")} />
    );
    
  return (
    <ListPageWrapper
      title={t("title")}
      subtitle={t("subtitle")}
    >
      {projectItems.map((projectItem, index) => (
        <PurchaseItem
          key={projectItem.id}
          projectItem={projectItem}
          index={index}
        />
      ))}
    </ListPageWrapper>
  );
}

export default ProjectItemsPage;
