import DocumentsList from "@/components/documents-list";
import ErrorPage from "@/components/error";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getItemDocumentsAction } from "@/server/actions/document-relations/read";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function ClientDocumentsPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("item.documents");

  const itemId = parseInt(params.id);
  if (isNaN(itemId)) return <ErrorPage message={t("invalid-id")} />;

  const [documents, error] = await getItemDocumentsAction(itemId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!documents.length)
    return <ErrorPage title={t("no-documents-found-error-message")} />;

  return (
    <ListPageWrapper title={t("title")} subtitle={t("subtitle")}>
      <DocumentsList documents={documents} />
    </ListPageWrapper>
  );
}

export default ClientDocumentsPage;
