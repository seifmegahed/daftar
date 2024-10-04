import InfoPageWrapper from "@/components/info-page-wrapper";
import { getItemProjectsAction } from "@/server/actions/project-items/read";
import ProjectCard from "@/app/(auth)/projects/all-projects/project-card";

async function ItemProjectsPage({params}: { params: { id: string } }) {
  const itemId = Number(params.id);
  if (isNaN(itemId)) return <p>Error: Item ID is not a number</p>;

  const [projects, error] = await getItemProjectsAction(itemId);
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <InfoPageWrapper
      title="Item's Projects"
      subtitle="This is a list of the projects where this item is referenced."
    >
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </InfoPageWrapper>
  );
}

export default ItemProjectsPage;
