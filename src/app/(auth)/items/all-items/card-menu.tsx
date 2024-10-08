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

const ItemCardContextMenu = ({ itemId }: { itemId: number }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
          <DotsVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href={`/item/${itemId}`}>
          <DropdownMenuItem>Item Page</DropdownMenuItem>
        </Link>
        <Link href={`/item/${itemId}/documents`}>
          <DropdownMenuItem>Item Documents</DropdownMenuItem>
        </Link>
        <Separator className="my-1" />
        <Link href={`/item/${itemId}/edit`}>
          <DropdownMenuItem>Edit Item</DropdownMenuItem>
        </Link>
        <Link href={`/item/${itemId}/edit#delete`} scroll>
          <DropdownMenuItem>
            <p className="text-red-500">Delete Item</p>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ItemCardContextMenu;
