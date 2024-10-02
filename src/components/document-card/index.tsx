import { FileIcon } from "lucide-react";
import Link from "next/link";
import { type SimpDoc } from "@/server/db/tables/document/queries";
import DocumentCardContextMenu from "./context-menu";

const DocumentCard = ({ document }: { document: SimpDoc }) => {
  return (
    <div className="flex justify-between pl-5">
      <div className="flex items-center gap-x-2">
        <div className="relative cursor-pointer">
          <FileIcon className="h-8 w-8" />
          <p className="absolute left-2 top-3 w-4 select-none text-center text-[6pt] font-medium">
            {document.extension}
          </p>
        </div>
        <Link
          href={`/api/download-document/${document.id}`}
          className="cursor-pointer underline"
        >
          {document.name}
        </Link>
      </div>
      <DocumentCardContextMenu document={document} />
    </div>
  );
};

export default DocumentCard;
