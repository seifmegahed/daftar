import { getItemProjectsAction } from "@/server/actions/project-items/read";
import ProjectCard from "@/app/(auth)/projects/all-projects/project-card";
import ListPageWrapper from "@/components/list-page-wrapper";

async function ItemProjectsPage({ params }: { params: { id: string } }) {
  const itemId = Number(params.id);
  if (isNaN(itemId)) return <p>Error: Item ID is not a number</p>;

  const [projects, error] = await getItemProjectsAction(itemId);
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <ListPageWrapper
      title="Item's Projects"
      subtitle="This is a list of the projects where this item is referenced."
    >
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ListPageWrapper>
  );
}

export default ItemProjectsPage;
