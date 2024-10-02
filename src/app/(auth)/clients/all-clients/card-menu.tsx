"use client";

import Link from "next/link";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const ClientCardContextMenu = ({ clientId }: { clientId: number }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="z-50 flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
          <DotsVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href={`/client/${clientId}`}>
          <DropdownMenuItem>Client Page</DropdownMenuItem>
        </Link>
        <Link href={`/client/${clientId}/items`}>
          <DropdownMenuItem>Client Items</DropdownMenuItem>
        </Link>
        <Link href={`/client/${clientId}/documents`}>
          <DropdownMenuItem>Client Documents</DropdownMenuItem>
        </Link>
        <Separator className="my-1" />
        <Link href={`/client/${clientId}/edit`}>
          <DropdownMenuItem>Edit Client</DropdownMenuItem>
        </Link>
        <Link href={`/client/${clientId}/edit#delete`} scroll>
          <DropdownMenuItem>
            <p className="text-red-500">Delete Client</p>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClientCardContextMenu;
