import { getProjectItemsAction } from "@/server/actions/project-items/read";
import ProjectItemCard from "./project-item-card";
import ListPageWrapper from "@/components/list-page-wrapper";

export const dynamic = "force-dynamic";

async function ProjectItemsPage({ params }: { params: { id: string } }) {
  const [projectItems, error] = await getProjectItemsAction(Number(params.id));
  if (error !== null) return <div>Error getting project items</div>;
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
