import { getProjectDocumentsAction } from "@/server/actions/document-relations/read";
import DocumentsList from "@/components/documents-list";
import ListPageWrapper from "@/components/list-page-wrapper";

async function ProjectDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getProjectDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
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
