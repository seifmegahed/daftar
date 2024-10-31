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

const SupplierCardContextMenu = ({ supplierId }: { supplierId: number }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
          <DotsVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href={`/supplier/${supplierId}`}>
          <DropdownMenuItem>Supplier Page</DropdownMenuItem>
        </Link>
        <Link href={`/supplier/${supplierId}/documents`}>
          <DropdownMenuItem>Supplier Documents</DropdownMenuItem>
        </Link>
        <Separator className="my-1" />
        <Link href={`/supplier/${supplierId}/edit`}>
          <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
        </Link>
        <Link href={`/supplier/${supplierId}/edit#delete`} scroll>
          <DropdownMenuItem>
            <p className="text-red-500">Delete Supplier</p>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SupplierCardContextMenu;
