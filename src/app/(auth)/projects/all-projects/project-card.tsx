"use client";

import { getStatusLabel } from "@/data/lut";
import Link from "next/link";
import { format } from "date-fns";
import ProjectCardContextMenu from "./card-menu";

const ProjectCard = ({
  project,
}: {
  project: {
    id: number;
    name: string;
    status: number;
    clientId: number;
    clientName: string;
    createdAt: Date;
  };
}) => {
  return (
    <div className="flex items-center gap-5 rounded-xl border p-4">
      <Link href={`/project/${project.id}`}>
        <div className="flex cursor-pointer items-center justify-center">
          <p className="w-10 text-right text-2xl font-bold text-foreground">
            {project.id}
          </p>
        </div>
      </Link>
      <div className="flex w-full items-center justify-between">
        <div>
          <Link href={`/project/${project.id}`}>
            <p className="cursor-pointer text-foreground hover:underline">
              {project.name}
            </p>
          </Link>
          <Link href={`/client/${project.clientId}`}>
            <p className="cursor-pointer text-xs text-muted-foreground hover:underline">
              {project.clientName}
            </p>
          </Link>
        </div>
        <div className="w-36 text-end">
          <p className="text-foreground">{getStatusLabel(project.status)}</p>
          <p className="text-xs text-muted-foreground">
            {format(project.createdAt, "PP")}
          </p>
        </div>
      </div>
      <ProjectCardContextMenu projectId={project.id} />
    </div>
  );
};

export default ProjectCard;
