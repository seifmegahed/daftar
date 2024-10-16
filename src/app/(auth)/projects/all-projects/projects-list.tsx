import { getProjectsBriefAction } from "@/server/actions/projects/read";
import ProjectCard from "./project-card";
import type { FilterArgs } from "@/components/filter-and-search";
import ErrorPage from "@/components/error";

async function ProjectsList({
  page = 1,
  query,
  filter,
}: {
  page?: number;
  query?: string;
  filter: FilterArgs;
}) {
  const [projects, error] = await getProjectsBriefAction(page, filter, query);

  if (error !== null) return <ErrorPage message={error} />;

  if (!projects.length)
    return (
      <ErrorPage
        title="There seems to be no projects!"
        message="Start adding projects to see them here."
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
