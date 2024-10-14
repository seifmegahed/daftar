import ProjectCard from "@/app/(auth)/projects/all-projects/project-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import { getClientProjectsAction } from "@/server/actions/projects/read";

async function ClientProjectsPage({ params }: { params: { id: string } }) {
  const [projects, error] = await getClientProjectsAction(Number(params.id));

  if (error !== null) return <p>Error getting client&apos;s projects</p>;

  await new Promise((r) => setTimeout(r, 5000));
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
