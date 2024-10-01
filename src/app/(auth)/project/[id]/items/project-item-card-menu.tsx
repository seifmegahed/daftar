"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const ProjectItemCardContextMenu = ({
  itemId,
  supplierId,
}: {
  itemId: number;
  supplierId: number;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="z-50 flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
          <DotsVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href={`/item/${itemId}`}>
          <DropdownMenuItem className="cursor-pointer">Item Page</DropdownMenuItem>
        </Link>
        <Link href={`/supplier/${supplierId}`}>
          <DropdownMenuItem className="cursor-pointer">Supplier Page</DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer">
          <p className="text-red-500">Delete</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectItemCardContextMenu;