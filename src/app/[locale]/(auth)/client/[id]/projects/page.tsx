import ProjectCard from "@/app/[locale]/(auth)/projects/all-projects/project-card";
import ErrorPage from "@/components/error";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getClientProjectsAction } from "@/server/actions/projects/read";

async function ClientProjectsPage({ params }: { params: { id: string } }) {
  const clientId = parseInt(params.id);
  if (isNaN(clientId)) return <ErrorPage message="Invalid client ID" />;

  const [projects, error] = await getClientProjectsAction(clientId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!projects.length)
    return (
      <ErrorPage title="There seems to be no projects linked to this client yet" />
    );

  return (
    <ListPageWrapper
      title="Client's Projects"
      subtitle="This is a list of the client's projects."
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ListPageWrapper>
  );
}

export default ClientProjectsPage;
