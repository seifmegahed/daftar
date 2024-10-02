import { getProjectDocumentsAction } from "@/server/actions/documents";
import DocumentsList from "./documentsList";

async function ProjectDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getProjectDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl">Project Documents</h1>
      <div>
        <DocumentsList documents={documents} />
      </div>
    </div>
  );
}

export default ProjectDocumentsPage;
