import { getItemProjectsAction } from "@/server/actions/items/read";
import ProjectCard from "@/app/[locale]/(auth)/projects/all-projects/project-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function ItemProjectsPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("item.projects");

  const itemId = parseInt(params.id);
  if (isNaN(itemId)) return <ErrorPage message={t("invalid-id")} />;

  const [projects, error] = await getItemProjectsAction(itemId);
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

export default ItemProjectsPage;
