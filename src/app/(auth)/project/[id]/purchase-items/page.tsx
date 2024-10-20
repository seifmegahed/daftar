import { getPurchaseItemsAction } from "@/server/actions/purchase-items/read";
import ProjectItemCard from "./project-item-card";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

async function ProjectItemsPage({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id);
  if (isNaN(projectId)) return <ErrorPage message="Invalid project ID" />;

  const [projectItems, error] = await getPurchaseItemsAction(projectId);
  if (error !== null) return <ErrorPage message={error} />;
  if (!projectItems.length)
    return (
      <ErrorPage title="There seems to be no items linked to this project yet" />
    );
    
  return (
    <ListPageWrapper
      title="Project's Purchased Items"
      subtitle="This is the purchased items page for this project."
    >
      {projectItems.map((projectItem, index) => (
        <ProjectItemCard
          key={projectItem.id}
          projectItem={projectItem}
          index={index}
        />
      ))}
    </ListPageWrapper>
  );
}

export default ProjectItemsPage;
