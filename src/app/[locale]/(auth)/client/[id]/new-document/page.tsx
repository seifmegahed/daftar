import DocumentForm from "@/components/common-forms/document-form";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

async function NewDocumentPage({
  params,
}: {
  params: { id: string; locale: Locale };
}) {
  setLocale(params.locale);
  const t = await getTranslations("invalid-type-id");

  const clientId = parseInt(params.id);
  if (isNaN(clientId))
    return <ErrorPage message={t("message", { type: "client" })} />;

  return (
    <DocumentForm
      relationData={{ relationTo: "client", relationId: clientId }}
    />
  );
}

export default NewDocumentPage;
