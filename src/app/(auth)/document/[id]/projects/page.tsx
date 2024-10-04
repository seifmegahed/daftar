import { getDocumentProjectsAction } from "@/server/actions/document-relations/read";
import InfoPageWrapper from "@/components/info-page-wrapper";
import ProjectCard from "../../../projects/all-projects/project-card";

async function DocumentProjectsPage({ params }: { params: { id: string } }) {
  const documentId = Number(params.id);
  if (isNaN(documentId)) return <p>Error: Document ID is not a number</p>;

  const [projects, error] = await getDocumentProjectsAction(documentId);
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <InfoPageWrapper
      title="Document's Projects"
      subtitle="This is a list of the projects that reference this document."
    >
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </InfoPageWrapper>
  );
}

export default DocumentProjectsPage;
