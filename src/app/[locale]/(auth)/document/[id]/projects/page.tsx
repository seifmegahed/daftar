import { getDocumentProjectsAction } from "@/server/actions/document-relations/read";
import ProjectCard from "@/app/[locale]/(auth)/projects/all-projects/project-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function DocumentProjectsPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("document.projects");

  const documentId = parseInt(params.id);
  if (isNaN(documentId)) return <ErrorPage message={t("invalid-id")} />;

  const [projects, error] = await getDocumentProjectsAction(documentId);
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

export default DocumentProjectsPage;
