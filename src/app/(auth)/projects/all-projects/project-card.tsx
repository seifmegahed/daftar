"use client";

import { getStatusLabel } from "@/data/lut";
import Link from "next/link";
import { format } from "date-fns";
import { type BriefProjectType } from "@/server/db/tables/project/queries";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const ProjectCard = ({ project }: { project: BriefProjectType }) => {
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
        <div className="w-36 text-right">
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

const ProjectCardContextMenu = ({ projectId }: { projectId: number }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="z-50 flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
          <DotsVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href={`/project/${projectId}`}>
          <DropdownMenuItem>Project Page</DropdownMenuItem>
        </Link>
        <Link href={`/project/${projectId}/items`}>
          <DropdownMenuItem>Project Items</DropdownMenuItem>
        </Link>
        <Link href={`/project/${projectId}/documents`}>
          <DropdownMenuItem>Project Documents</DropdownMenuItem>
        </Link>
        <Separator className="my-1" />
        <Link href={`/project/${projectId}/edit`}>
          <DropdownMenuItem>Edit Project</DropdownMenuItem>
        </Link>
        <Link href={`/project/${projectId}/edit#delete`} scroll>
          <DropdownMenuItem>
            <p className="text-red-500">Delete Project</p>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectCard;
