import { getItemProjectsAction } from "@/server/actions/project-items/read";
import ProjectCard from "@/app/(auth)/projects/all-projects/project-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

async function ItemProjectsPage({ params }: { params: { id: string } }) {
  const itemId = parseInt(params.id);
  if (isNaN(itemId)) return <ErrorPage message="Invalid item ID" />;

  const [projects, error] = await getItemProjectsAction(itemId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!projects.length)
    return (
      <ErrorPage title="There seems to be no projects linked to this yet" />
    );

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
