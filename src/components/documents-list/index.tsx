import DocumentCard from "@/components/document-card";
import { type SimpDoc } from "@/server/db/tables/document/queries";

function DocumentsList({ documents }: { documents: SimpDoc[] }) {
  return (
    <div className="flex flex-col gap-y-4 text-muted-foreground">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  );
}

export default DocumentsList;
