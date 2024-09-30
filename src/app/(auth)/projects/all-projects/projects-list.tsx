import { getProjectsBriefAction } from "@/server/actions/projects";
import ProjectCard from "./project-card";

async function ProjectsList({
  page = 1,
  query,
}: {
  page?: number;
  query?: string;
}) {
  const [projects, error] = await getProjectsBriefAction(page, query);

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
