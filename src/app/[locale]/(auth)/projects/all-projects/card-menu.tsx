"use client";

import { Link } from "@/i18n/routing";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const ProjectCardContextMenu = ({ projectId }: { projectId: number }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
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

export default ProjectCardContextMenu;
