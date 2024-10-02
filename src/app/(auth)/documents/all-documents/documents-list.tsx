import { getDocumentsAction } from "@/server/actions/documents";
import DocumentCard from "./document-card";

async function DocumentsList({
  page = 1,
  query,
}: {
  page?: number;
  query?: string;
}) {
  const [documents, error] = await getDocumentsAction(page, query);

  if (error !== null) return <div>Error getting documents</div>;

  if (documents.length === 0) return <div>No documents found</div>;

  return (
    <div className="flex flex-col gap-4">
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
}

export default DocumentsList;
