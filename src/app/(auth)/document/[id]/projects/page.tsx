import { getDocumentProjectsAction } from "@/server/actions/document-relations/read";
import ProjectCard from "../../../projects/all-projects/project-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

async function DocumentProjectsPage({ params }: { params: { id: string } }) {
  const documentId = parseInt(params.id);
  if (isNaN(documentId)) return <ErrorPage message="Invalid document Id" />;

  const [projects, error] = await getDocumentProjectsAction(documentId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!projects.length)
    return (
      <ErrorPage title="There seems to be no projects linked to this document yet" />
    );

  return (
    <ListPageWrapper
      title="Document's Projects"
      subtitle="This is a list of the projects that reference this document."
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ListPageWrapper>
  );
}

export default DocumentProjectsPage;
