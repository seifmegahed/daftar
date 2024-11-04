import { getClientDocumentsAction } from "@/server/actions/document-relations/read";
import DocumentsList from "@/components/documents-list";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function ClientDocumentsPage({ params }: { params: { id: string; locale: Locale } }) {
  setLocale(params.locale);
  const t = await getTranslations("client.documents");

  const clientId = parseInt(params.id);
  if (isNaN(clientId)) return <ErrorPage message={t("invalid-id")} />;

  const [documents, error] = await getClientDocumentsAction(clientId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!documents.length)
    return (
      <ErrorPage title={t("no-documents-found-error-message")} />
    );

  return (
    <ListPageWrapper
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <DocumentsList documents={documents} />
    </ListPageWrapper>
  );
}

export default ClientDocumentsPage;
