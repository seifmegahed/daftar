import { getDocumentClientsAction } from "@/server/actions/document-relations/read";
import ClientCard from "../../../clients/all-clients/client-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function DocumentClientsPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("document.clients");

  const documentId = parseInt(params.id);
  if (isNaN(documentId)) return <ErrorPage message={t("invalid-id")} />;

  const [clients, error] = await getDocumentClientsAction(documentId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!clients.length)
    return <ErrorPage title={t("no-clients-found-error-message")} />;

  return (
    <ListPageWrapper title={t("title")} subtitle={t("subtitle")}>
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </ListPageWrapper>
  );
}

export default DocumentClientsPage;
