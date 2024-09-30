import { getProjectsBriefAction } from "@/server/actions/projects";
import ProjectCard from "./project-card";

async function ProjectsList({ page = 1 }: { page?: number }) {
  const [projects, error] = await getProjectsBriefAction(page, "system");

  if (error !== null) return <div>Error getting projects</div>;

  return (
    <div className="flex flex-col gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectsList;
