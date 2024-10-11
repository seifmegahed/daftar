"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProjectItemAction } from "@/server/actions/project-items/delete";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

const ProjectItemCardContextMenu = ({
  itemId,
  supplierId,
  projectItemId,
}: {
  itemId: number;
  supplierId: number;
  projectItemId: number;
}) => {
  const navigate = useRouter();

  const handleDelete = async () => {
    const result = confirm("Are you sure you want to delete this item?");
    if (!result) return;
    try {
      const [, error] = await deleteProjectItemAction(projectItemId);
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
        <Link href={`/supplier/${supplierId}`}>
          <DropdownMenuItem className="cursor-pointer">
            Supplier Page
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
          <p className="text-red-500">Delete</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectItemCardContextMenu;
