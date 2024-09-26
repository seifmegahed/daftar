import { getProjectByIdAction } from "@/server/actions/projects";

async function ProjectPage({ params }: { params: { id: string } }) {
  const [project, error] = await getProjectByIdAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div>
      <p>Project:</p>
      <pre>{JSON.stringify(project, null, 2)}</pre>
    </div>
  );
}

export default ProjectPage;
