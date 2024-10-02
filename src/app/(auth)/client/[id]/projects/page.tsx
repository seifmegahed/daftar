import ProjectCard from "@/app/(auth)/projects/all-projects/project-card";
import InfoPageWrapper from "@/components/info-page-wrapper";
import { getClientProjectsAction } from "@/server/actions/projects";

async function ClientProjectsPage({ params }: { params: { id: string } }) {
  const [projects, error] = await getClientProjectsAction(Number(params.id));

  if (error !== null) return <p>Error getting client&apos;s projects</p>;
  return (
    <InfoPageWrapper
      title="Client's Projects"
      subtitle="This is a list of the client's projects."
    >
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </InfoPageWrapper>
  );
}

export default ClientProjectsPage;
