"use client";

import Link from "next/link";
import { format } from "date-fns";
import { type BriefSupplierType } from "@/server/db/tables/supplier/queries";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const SupplierCard = ({ supplier }: { supplier: BriefSupplierType }) => {
  return (
    <div className="flex items-center gap-5 rounded-xl border p-4">
      <Link href={`/supplier/${supplier.id}`}>
        <div className="flex cursor-pointer items-center justify-center">
          <p className="w-10 text-right text-2xl font-bold text-foreground">
            {supplier.id}
          </p>
        </div>
      </Link>
      <div className="flex w-full items-center justify-between">
        <div>
          <Link href={`/supplier/${supplier.id}`}>
            <p className="cursor-pointer text-foreground hover:underline line-clamp-1">
              {supplier.name}
            </p>
          </Link>
          <Link href={`/client/${supplier.field}`}>
            <p className="cursor-pointer text-xs text-muted-foreground hover:underline">
              {supplier.field}
            </p>
          </Link>
        </div>
        <div className="w-56 text-right">
          <p className="text-foreground line-clamp-1">{supplier.registrationNumber}</p>
          <p className="text-xs text-muted-foreground">
            {format(supplier.createdAt, "PP")}
          </p>
        </div>
      </div>
      <SupplierCardContextMenu supplierId={supplier.id} />
    </div>
  );
};

const SupplierCardContextMenu = ({ supplierId }: { supplierId: number }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="z-50 flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
          <DotsVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href={`/supplier/${supplierId}`}>
          <DropdownMenuItem>Supplier Page</DropdownMenuItem>
        </Link>
        <Link href={`/supplier/${supplierId}/items`}>
          <DropdownMenuItem>Supplier Items</DropdownMenuItem>
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

export default SupplierCard;
