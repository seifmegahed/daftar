import { getProjectLinkedDocumentsAction } from "@/server/actions/projects";

async function ProjectDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getProjectLinkedDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div>
      <p>Project Documents:</p>
      <pre>{JSON.stringify(documents, null, 2)}</pre>
    </div>
  );
}

export default ProjectDocumentsPage;
