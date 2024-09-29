import { statusCodes } from "@/data/lut";
import {
  getProjectsBriefAction,
  getProjectsCountAction,
} from "@/server/actions/projects";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

async function AllProjectsPage({ page = 1 }: { page?: number }) {
  const [projects, error] = await getProjectsBriefAction(page);
  if (error !== null) return <div>Error getting projects</div>;

  const [projectsCount, projectsCountError] = await getProjectsCountAction();
  if (projectsCountError !== null) return <div>Error getting projects</div>;

  const totalPages = Math.ceil(projectsCount / 10);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Projects Page</h3>
      <p className="text-sm text-muted-foreground">List of all projects.</p>
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

const ProjectCard = ({
  project,
}: {
  project: {
    id: number;
    name: string;
    client: { id: number; name: string };
    owner: { id: number; name: string };
    status: number;
    createdAt: Date;
  };
}) => {
  return (
    <Link href={`/project/${project.id}`}>
      <div className="flex cursor-pointer items-center gap-5 rounded-md border p-4 hover:bg-muted">
        <p className="w-8 text-right text-2xl font-bold text-foreground">
          {project.id}
        </p>
        <div className="flex w-full items-center justify-between">
          <div>
            <p className="text-foreground">{project.name}</p>
            <p className="text-xs text-muted-foreground">
              {project.client.name}
            </p>
          </div>
          <div className="w-36 text-right">
            <p className="text-foreground">
              {statusCodes.find((x) => x.value === project.status)?.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(project.createdAt, "PP")}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Pagination = ({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) => {
  return (
    <div className="flex justify-between">
      <Link
        href={`/projects?page=${page === 1 ? page : page - 1}`}
        className={`${page === 1 ? "cursor-default" : "cursor-pointer"}`}
      >
        <Button className="w-32" disabled={page === 1}>
          Previous
        </Button>
      </Link>
      <Link
        href={`/projects?page=${page === totalPages ? page : page + 1}`}
        className={`${page === totalPages ? "cursor-default" : "cursor-pointer"}`}
      >
        <Button className="w-32" disabled={page === totalPages}>
          Next
        </Button>
      </Link>
    </div>
  );
};

export default AllProjectsPage;
