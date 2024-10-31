import { getDocumentsAction } from "@/server/actions/documents/read";
import DocumentCard from "./document-card";
import ErrorPage from "@/components/error";
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
  if (error !== null) return <ErrorPage message={error} />;
  if (!documents.length)
    return (
      <ErrorPage
        title="There seems to be no documents yet"
        message="Start adding documents to be able to see them here"
      />
    );

  return (
    <div className="flex flex-col gap-4">
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
}

export default DocumentsList;
