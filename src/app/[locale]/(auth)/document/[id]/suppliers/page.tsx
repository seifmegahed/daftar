import { getDocumentSuppliersAction } from "@/server/actions/document-relations/read";
import SupplierCard from "@/app/[locale]/(auth)/suppliers/all-suppliers/supplier-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function DocumentSuppliersPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("document.suppliers");

  const documentId = parseInt(params.id);
  if (isNaN(documentId)) return <ErrorPage message={t("invalid-id")} />;

  const [suppliers, error] = await getDocumentSuppliersAction(documentId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!suppliers.length)
    return <ErrorPage title={t("no-suppliers-found-error-message")} />;

  return (
    <ListPageWrapper title={t("title")} subtitle={t("subtitle")}>
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </ListPageWrapper>
  );
}

export default DocumentSuppliersPage;
