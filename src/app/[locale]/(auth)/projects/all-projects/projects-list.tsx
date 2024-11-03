import { getProjectsBriefAction } from "@/server/actions/projects/read";
import ProjectCard from "./project-card";
import ErrorPage from "@/components/error";
import type { FilterArgs } from "@/components/filter-and-search";
import { getTranslations } from "next-intl/server";

async function ProjectsList({
  page = 1,
  query,
  filter,
}: {
  page: number;
  query?: string;
  filter: FilterArgs;
}) {
  const [projects, error] = await getProjectsBriefAction(page, filter, query);
  const t = await getTranslations("projects.page");

  if (error !== null) return <ErrorPage message={error} />;
  if (!projects.length && filter.filterType === null)
    return (
      <ErrorPage
        title={t("no-projects-found-error-title")}
        message={t("no-projects-found-error-message")}
      />
    );

  return (
    <div className="flex flex-col gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectsList;
