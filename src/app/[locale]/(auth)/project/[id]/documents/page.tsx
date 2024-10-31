import { getProjectDocumentsAction } from "@/server/actions/document-relations/read";
import DocumentsList from "@/components/documents-list";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

async function ProjectDocumentsPage({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id);
  if (isNaN(projectId)) return <ErrorPage message="Invalid project ID" />;

  const [documents, error] = await getProjectDocumentsAction(projectId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!documents.length)
    return (
      <ErrorPage title="There seems to be no documents linked to this project yet" />
    );
    
  return (
    <ListPageWrapper
      title="Project's Documents"
      subtitle="This is a list of the documents linked to the project."
    >
      <div>
        <DocumentsList documents={documents} />
      </div>
    </ListPageWrapper>
  );
}

export default ProjectDocumentsPage;
