import { getProjectDocumentsAction } from "@/server/actions/documents";
import DocumentsList from "@/components/documents-list";
import { Separator } from "@/components/ui/separator";

async function ProjectDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getProjectDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-bold">Project&apos;s Documents</h1>
      <Separator />
      <p className="text-muted-foreground">
        This is a list of the documents linked to the project.
      </p>
      <div>
        <DocumentsList documents={documents} />
      </div>
    </div>
  );
}

export default ProjectDocumentsPage;
