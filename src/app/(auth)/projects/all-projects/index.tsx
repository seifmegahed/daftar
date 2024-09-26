import { statusCodes } from "@/data/lut";
import { getProjectsBriefAction } from "@/server/actions/projects";
import Link from "next/link";

async function AllProjectsPage() {
  const [projects, error] = await getProjectsBriefAction();
  if (error !== null) return <div>Error getting projects</div>;
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Projects Page</h3>
      <p className="text-sm text-muted-foreground">List of all projects.</p>
      <div className="flex flex-col gap-2">
        {projects.map((project) => (
          <Link key={project.id} href={`/project/${project.id}`}>
            <div className="flex cursor-pointer items-center justify-between gap-2 rounded-md border p-3 hover:bg-muted">
              <div className="text-sm text-muted-foreground">
                {project.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {project.client.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {project.owner.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {statusCodes.find((x) => x.value === project.status)?.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllProjectsPage;
