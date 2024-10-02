import { getClientDocumentsAction } from "@/server/actions/documents";
import DocumentsList from "@/components/documents-list";
import { Separator } from "@/components/ui/separator";

async function ClientDocumentsPage({ params }: { params: { id: string } }) {
  const [documents, error] = await getClientDocumentsAction(Number(params.id));
  if (error !== null) return <p>Error: {error}</p>;
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-bold">Client&apos;s Documents</h1>
      <Separator />
      <p className="text-muted-foreground">
        This is a list of the documents linked to the client.
      </p>
      <div>
        <DocumentsList documents={documents} />
      </div>
    </div>
  );
}

export default ClientDocumentsPage;
