import { getProjectItemsAction } from "@/server/actions/projects";

async function ProjectItemsPage({ params }: { params: { id: string } }) {
  const [projectItems, error] = await getProjectItemsAction(Number(params.id));
  if (error !== null) return <div>Error getting project items</div>;
  return (
    <div>
      <p>Project Items:</p>
      <pre>{JSON.stringify(projectItems, null, 2)}</pre>
    </div>
  );
}

export default ProjectItemsPage;
