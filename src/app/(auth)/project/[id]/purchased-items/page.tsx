import { getProjectItemsAction } from "@/server/actions/project-items/read";
import ProjectItemCard from "./project-item-card";
import InfoPageWrapper from "@/components/info-page-wrapper";

export const dynamic = "force-dynamic";

async function ProjectItemsPage({ params }: { params: { id: string } }) {
  const [projectItems, error] = await getProjectItemsAction(Number(params.id));
  if (error !== null) return <div>Error getting project items</div>;
  return (
    <InfoPageWrapper
      title="Project's Purchased Items"
      subtitle="This is the purchased items page for this project." 
    >
      <div className="flex flex-col gap-5">
        {projectItems.map((projectItem, index) => (
          <ProjectItemCard
            key={projectItem.id}
            projectItem={projectItem}
            index={index}
          />
        ))}
      </div>
    </InfoPageWrapper>
  );
}

export default ProjectItemsPage;
