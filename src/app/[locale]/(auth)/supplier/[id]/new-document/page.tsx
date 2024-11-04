import DocumentForm from "@/components/common-forms/document-form";
import ErrorPage from "@/components/error";
import { getTranslations } from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";
import { getLocaleType } from "@/utils/common";

async function NewDocumentPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  const localizedType = getLocaleType("supplier", locale);
  const t = await getTranslations("invalid-type-id");

  const supplierId = parseInt(params.id);
  if (isNaN(supplierId))
    return <ErrorPage message={t("message", { type: localizedType })} />;

  return (
    <DocumentForm
      relationData={{ relationTo: "supplier", relationId: supplierId }}
    />
  );
}

export default NewDocumentPage;
