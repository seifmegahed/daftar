import { getStatusLabel } from "@/data/lut";
import Link from "next/link";
import { format } from "date-fns";
import { type BriefProjectType } from "@/server/db/tables/project/queries";

const ProjectCard = ({ project }: { project: BriefProjectType }) => {
  return (
    <Link href={`/project/${project.id}`}>
      <div className="flex cursor-pointer items-center gap-5 rounded-xl border p-4 hover:bg-muted">
        <p className="w-8 text-right text-2xl font-bold text-foreground">
          {project.id}
        </p>
        <div className="flex w-full items-center justify-between">
          <div>
            <p className="text-foreground">{project.name}</p>
            <p className="text-xs text-muted-foreground">
              {project.clientName}
            </p>
          </div>
          <div className="w-36 text-right">
            <p className="text-foreground">{getStatusLabel(project.status)}</p>
            <p className="text-xs text-muted-foreground">
              {format(project.createdAt, "PP")}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
