import { getProjectDocumentsAction } from "@/server/actions/document-relations/read";
import DocumentsList from "@/components/documents-list";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import { getTranslations } from "next-intl/server";
import { setLocale } from "@/i18n/set-locale";

async function ProjectDocumentsPage({ params }: { params: { id: string; locale:  Locale } }) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("project.documents-page");
  const projectId = parseInt(params.id);
  if (isNaN(projectId)) return <ErrorPage message={t("invalid-id")} />;

  const [documents, error] = await getProjectDocumentsAction(projectId);
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
      <div>
        <DocumentsList documents={documents} />
      </div>
    </ListPageWrapper>
  );
}

export default ProjectDocumentsPage;
