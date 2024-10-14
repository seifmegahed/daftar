"use client";

import { getStatusLabel } from "@/data/lut";
import Link from "next/link";
import { format } from "date-fns";
import ProjectCardContextMenu from "./card-menu";
import CardWrapper from "@/components/card-wrapper";

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
    <CardWrapper>
      <Link href={`/project/${project.id}`} className="hidden sm:block">
        <div className="flex cursor-pointer items-center justify-center">
          <p className="w-10 text-right text-2xl font-bold text-foreground">
            {project.id}
          </p>
        </div>
      </Link>
      <div className="flex w-full sm:items-center flex-col sm:flex-row justify-between gap-2 sm:gap-0">
        <div>
          <Link href={`/project/${project.id}`}>
            <p className="cursor-pointer text-foreground hover:underline font-bold text-lg">
              {project.name}
            </p>
          </Link>
          <Link href={`/client/${project.clientId}`}>
            <p className="cursor-pointer text-xs text-muted-foreground hover:underline">
              {project.clientName}
            </p>
          </Link>
        </div>
        <div className="sm:w-36 sm:text-end">
          <p className="text-foreground">{getStatusLabel(project.status)}</p>
          <p className="text-xs text-muted-foreground">
            {format(project.createdAt, "PP")}
          </p>
        </div>
      </div>
      <ProjectCardContextMenu projectId={project.id} />
    </CardWrapper>
  );
};

export default ProjectCard;
