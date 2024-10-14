import Link from "next/link";
import { Lock } from "lucide-react";
import { format } from "date-fns";
import { type BriefDocumentType } from "@/server/db/tables/document/queries";
import DocumentCardContextMenu from "./card-menu";
import CardWrapper from "@/components/card-wrapper";

const DocumentCard = ({ document }: { document: BriefDocumentType }) => {
  return (
    <CardWrapper>
      <Link href={`/document/${document.id}`} className="hidden sm:block">
        <div className="flex cursor-pointer items-center justify-center">
          <p className="w-10 text-right text-2xl font-bold text-foreground">
            {document.id}
          </p>
        </div>
      </Link>
      <div className="flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
        <Link href={`/document/${document.id}`}>
          <p className="line-clamp-1 cursor-pointer text-lg font-bold text-foreground hover:underline">
            {document.name}
          </p>
        </Link>
        <div className="sm:w-60 sm:text-end">
          <div className="flex items-center gap-4 sm:justify-end">
            {document.private && (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
            <p className="line-clamp-1 text-foreground">{document.extension}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {format(document.createdAt, "PP")}
          </p>
        </div>
      </div>
      <div>
        <DocumentCardContextMenu documentId={document.id} />
      </div>
    </CardWrapper>
  );
};

export default DocumentCard;
