import { getDocumentsAction } from "@/server/actions/documents/read";
import DocumentCard from "./document-card";
import type { FilterArgs } from "@/components/filter-and-search";

async function DocumentsList({
  page = 1,
  query,
  filter,
}: {
  page?: number;
  query?: string;
  filter?: FilterArgs;
}) {
  const [documents, error] = await getDocumentsAction(page, filter, query);

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
