import { FileIcon } from "lucide-react";
import Link from "next/link";
import { type SimpDoc } from "@/server/db/tables/document/queries";
import DocumentCardContextMenu from "./context-menu";
import { cn } from "@/lib/utils";

const DocumentCard = ({ document }: { document: SimpDoc }) => {
  return (
    <div className="flex justify-between sm:ps-5 sm:px-0 px-3">
      <div className="flex items-center gap-x-2">
        <div className="relative cursor-pointer">
          <FileIcon className="h-8 w-8" />
          {document.private && (
            <Lock className="absolute top-1 left-[6px] h-2 w-2 font-bold" />
          )}
          <p className="absolute left-2 top-3 w-4 select-none text-center text-[6pt] font-medium">
            {document.extension.length > 3
              ? document.extension.slice(0, 3)
              : document.extension}
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

const Lock = ({className} : {className?: string}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={cn("h-4 w-4", className)}
  >
    <path
      fillRule="evenodd"
      d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z"
      clipRule="evenodd"
    />
  </svg>
);

export default DocumentCard;
