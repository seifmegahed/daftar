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
  const t = await getTranslations("invalid-type-id");
  const itemId = parseInt(params.id);
  if (isNaN(itemId))
    return (
      <ErrorPage
        message={t("message", { type: getLocaleType("item", locale) })}
      />
    );

  return (
    <DocumentForm relationData={{ relationTo: "item", relationId: itemId }} />
  );
}

export default NewDocumentPage;
