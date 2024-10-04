"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { unlinkDocumentAction } from "@/server/actions/document-relations/delete";
import { type SimpDoc } from "@/server/db/tables/document/queries";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

const DocumentCardContextMenu = ({ document }: { document: SimpDoc }) => {
  const navigate = useRouter();

  const handleUnlink = async () => {
    if (!document.relationId) return;
    try {
      const [, error] = await unlinkDocumentAction(document.relationId);
      if (error !== null) {
        console.log(error);
        toast.error("Error unlinking document");
      } else {
        navigate.refresh();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error unlinking document");
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
        <Link href={`/document/${document.id}`}>
          <DropdownMenuItem className="cursor-pointer">
            Document Page
          </DropdownMenuItem>
        </Link>
        <Link href={`/api/download-document/${document.id}`}>
          <DropdownMenuItem className="cursor-pointer">
            Download Document
          </DropdownMenuItem>
        </Link>
        {document.relationId ? (
          <DropdownMenuItem className="cursor-pointer" onClick={handleUnlink}>
            <p className="text-red-500">Unlink Document</p>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DocumentCardContextMenu;
