import DocumentsList from "@/components/documents-list";
import ErrorPage from "@/components/error";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getSupplierDocumentsAction } from "@/server/actions/document-relations/read";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function SupplierDocumentsPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("supplier.documents");

  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message={t("invalid-id")} />;

  const [documents, error] = await getSupplierDocumentsAction(supplierId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!documents.length)
    return <ErrorPage title={t("no-documents-found-error-message")} />;

  return (
    <ListPageWrapper title={t("title")} subtitle={t("subtitle")}>
      <div>
        <DocumentsList documents={documents} />
      </div>
    </ListPageWrapper>
  );
}

export default SupplierDocumentsPage;
