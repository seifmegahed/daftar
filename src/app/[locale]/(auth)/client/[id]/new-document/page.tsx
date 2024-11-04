import DocumentForm from "@/components/common-forms/document-form";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";
import { getLocaleType } from "@/utils/common";

async function NewDocumentPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  const { locale } = params;
  setLocale(locale);
  const localizedType = getLocaleType("client", locale);
  const t = await getTranslations("invalid-type-id");

  const clientId = parseInt(params.id);
  if (isNaN(clientId))
    return <ErrorPage message={t("message", { type: localizedType })} />;

  return (
    <DocumentForm
      relationData={{ relationTo: "client", relationId: clientId }}
    />
  );
}

export default NewDocumentPage;
