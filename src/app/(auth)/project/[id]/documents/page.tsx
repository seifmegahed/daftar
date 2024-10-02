import { getProjectDocumentsAction } from "@/server/actions/documents";
import DocumentsList from "@/components/documents-list";
import InfoPageWrapper from "@/components/info-page-wrapper";

async function ProjectDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getProjectDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <InfoPageWrapper
      title="Project's Documents"
      subtitle="This is a list of the documents linked to the project."
    >
      <div>
        <DocumentsList documents={documents} />
      </div>
    </InfoPageWrapper>
  );
}

export default ProjectDocumentsPage;
