import ProjectCard from "@/app/[locale]/(auth)/projects/all-projects/project-card";
import ErrorPage from "@/components/error";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getSupplierProjectsAction } from "@/server/actions/purchase-items/read";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function SupplierProjectsPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("supplier.projects");

  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message={t("invalid-id")} />;

  const [projects, error] = await getSupplierProjectsAction(supplierId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!projects.length)
    return <ErrorPage title={t("no-projects-found-error-message")} />;

  return (
    <ListPageWrapper title={t("title")} subtitle={t("subtitle")}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ListPageWrapper>
  );
}

export default SupplierProjectsPage;
