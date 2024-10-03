"use document";

import Link from "next/link";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const DocumentCardContextMenu = ({ documentId }: { documentId: number }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
          <DotsVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href={`/document/${documentId}`}>
          <DropdownMenuItem>Document Page</DropdownMenuItem>
        </Link>
        <Separator className="my-1" />
        <Link href={`/document/${documentId}/edit`}>
          <DropdownMenuItem>Edit Document</DropdownMenuItem>
        </Link>
        <Link href={`/document/${documentId}/edit#delete`} scroll>
          <DropdownMenuItem>
            <p className="text-red-500">Delete Document</p>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DocumentCardContextMenu;
