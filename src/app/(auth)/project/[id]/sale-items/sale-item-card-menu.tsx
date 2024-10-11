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
import { useRouter } from "next/navigation";

import { toast } from "sonner";

const SaleItemCardMenu = ({
  itemId,
  saleItemId,
}: {
  itemId: number;
  saleItemId: number;
}) => {
  const navigate = useRouter();

  const handleDelete = async () => {
    const result = confirm("Are you sure you want to delete this item?");
    if (!result) return;
    try {
      const [, error] = await deleteCommercialOfferItemAction(saleItemId);
      if (error !== null) {
        console.log(error);
        toast.error("Error deleting item");
      }
      else {
        navigate.refresh();
      }
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
