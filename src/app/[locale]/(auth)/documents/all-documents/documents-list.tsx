import { getDocumentsAction } from "@/server/actions/documents/read";
import DocumentCard from "./document-card";
import ErrorPage from "@/components/error";
import { getTranslations } from "next-intl/server";
import type { FilterArgs } from "@/components/filter-and-search";

async function DocumentsList({
  page = 1,
  query,
  filter,
}: {
  page?: number;
  query?: string;
  filter: FilterArgs;
}) {
  const t = await getTranslations("documents.page");

  const [documents, error] = await getDocumentsAction(page, filter, query);
  if (error !== null) return <ErrorPage message={error} />;
  if (!documents.length && filter.filterType === null)
    return (
      <ErrorPage
        title={t("no-documents-found-error-title")}
        message={t("no-documents-found-error-message")}
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
