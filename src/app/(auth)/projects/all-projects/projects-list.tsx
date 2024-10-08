import { getProjectsBriefAction } from "@/server/actions/projects/read";
import ProjectCard from "./project-card";
import type { FilterArgs } from "@/server/db/tables/project/queries";

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

  if (error !== null) return <div>Error getting projects</div>;

  if (projects.length === 0) return <div>No projects found</div>;

  return (
    <div className="flex flex-col gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectsList;
