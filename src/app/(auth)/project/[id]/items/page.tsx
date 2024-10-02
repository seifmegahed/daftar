import { getProjectItemsAction } from "@/server/actions/projects";
import ProjectItemCard from "./project-item-card";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

async function ProjectItemsPage({ params }: { params: { id: string } }) {
  const [projectItems, error] = await getProjectItemsAction(Number(params.id));
  if (error !== null) return <div>Error getting project items</div>;
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-bold">Project&apos;s Items</h1>
      <Separator />
      <p className="text-muted-foreground">
        This is a list of all the items linked to this project. Here you can
        view or delete the items.
      </p>
      <div className="flex flex-col gap-5">
        {projectItems.map((projectItem, index) => (
          <ProjectItemCard
            key={projectItem.id}
            projectItem={projectItem}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectItemsPage;
