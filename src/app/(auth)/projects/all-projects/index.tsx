import { statusCodes } from "@/data/lut";
import {
  getProjectsBriefAction,
  getProjectsCountAction,
} from "@/server/actions/projects";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          <Link key={project.id} href={`/project/${project.id}`}>
            <div className="flex cursor-pointer items-center justify-between rounded-md border p-3 text-xs hover:bg-muted">
              <div className="line-clamp-1 w-36 text-sm text-muted-foreground">
                {project.name}
              </div>
              <div className="line-clamp-1 w-1/3 text-sm text-muted-foreground">
                {project.client.name}
              </div>
              <div className="line-clamp-1 w-36 text-left text-sm text-muted-foreground">
                {project.owner.name}
              </div>
              <div className="line-clamp-1 w-20 text-right text-sm text-muted-foreground">
                {statusCodes.find((x) => x.value === project.status)?.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
        <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

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
