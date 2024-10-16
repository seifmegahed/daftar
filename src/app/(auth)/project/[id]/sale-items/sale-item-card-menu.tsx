"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCommercialOfferItemAction } from "@/server/actions/commercial-offer-items/delete";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { toast } from "sonner";

const SaleItemCardMenu = ({
  itemId,
  saleItemId,
}: {
  itemId: number;
  saleItemId: number;
}) => {
  const handleDelete = async () => {
    const result = confirm("Are you sure you want to delete this item from the project?");
    if (!result) return;
    try {
      const [, error] = await deleteCommercialOfferItemAction(saleItemId);
      if (error !== null) {
        toast.error(error);
        return;
      }
      toast.success("Item deleted from project")
    } catch (error) {
      console.log(error);
      toast.error("Error deleting item");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center rounded-full p-2 hover:bg-muted">
          <DotsVerticalIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link href={`/item/${itemId}`}>
          <DropdownMenuItem className="cursor-pointer">
            Item Page
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
          <p className="text-red-500">Delete</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SaleItemCardMenu;
