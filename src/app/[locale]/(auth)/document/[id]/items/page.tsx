import { getDocumentItemsAction } from "@/server/actions/document-relations/read";
import ListPageWrapper from "@/components/list-page-wrapper";
import ItemCard from "../../../items/all-items/item-card";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function DocumentItemsPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("document.items");

  const documentId = parseInt(params.id);
  if (isNaN(documentId)) return <ErrorPage message={t("invalid-id")} />;

  const [items, error] = await getDocumentItemsAction(documentId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!items.length)
    return <ErrorPage title={t("no-items-found-error-message")} />;

  return (
    <ListPageWrapper title={t("title")} subtitle={t("subtitle")}>
      {items.map((client) => (
        <ItemCard key={client.id} item={client} />
      ))}
    </ListPageWrapper>
  );
}

export default DocumentItemsPage;
