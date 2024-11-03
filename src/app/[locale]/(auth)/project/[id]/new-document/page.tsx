import DocumentForm from "@/components/common-forms/document-form";
import ErrorPage from "@/components/error";
import { getTranslations } from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";
import type { LocaleParams } from "@/i18n/set-locale";

async function NewDocumentPage({
  params,
}: {
  params: { id: string; locale: LocaleParams["locale"] };
}) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("project");
  const projectId = parseInt(params.id);
  if (isNaN(projectId)) return <ErrorPage message={t("invalid-id")} />;

  return (
    <DocumentForm
      relationData={{ relationTo: "project", relationId: projectId }}
    />
  );
}

export default NewDocumentPage;
