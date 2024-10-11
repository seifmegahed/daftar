import Link from "next/link";
import { Lock } from "lucide-react";
import { format } from "date-fns";
import { type BriefDocumentType } from "@/server/db/tables/document/queries";
import DocumentCardContextMenu from "./card-menu";

const DocumentCard = ({ document }: { document: BriefDocumentType }) => {
  return (
    <div className="flex items-center gap-5 rounded-xl border p-4">
      <Link href={`/document/${document.id}`}>
        <div className="flex cursor-pointer items-center justify-center">
          <p className="w-10 text-right text-2xl font-bold text-foreground">
            {document.id}
          </p>
        </div>
      </Link>
      <div className="flex w-full items-center justify-between">
        <Link href={`/document/${document.id}`}>
          <p className="line-clamp-1 cursor-pointer text-xl text-foreground hover:underline">
            {document.name}
          </p>
        </Link>
        <div className="w-60 text-right">
          <div className="flex items-center gap-4 justify-end">
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
      <DocumentCardContextMenu documentId={document.id} />
    </div>
  );
};

export default DocumentCard;
