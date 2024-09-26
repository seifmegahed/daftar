import { getDocumentsAction } from "@/server/actions/documents";
import Link from "next/link";

async function AllDocuments() {
  const [documents, error] = await getDocumentsAction();
  if (error !== null) return <div>Error getting documents</div>;
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Documents Page</h3>
      <p className="text-sm text-muted-foreground">
        List of all documents.
      </p>
      <div className="flex flex-col gap-2">
        {documents.map((document) => (
          <Link key={document.id} href={`/document/${document.id}`}>
            <div
              className="flex cursor-pointer items-center gap-2 rounded-md border p-3 hover:bg-muted"
            >
              <div className="flex-1 text-sm text-muted-foreground">
                {document.name}
              </div>
              <div className="flex-1 text-sm text-muted-foreground">
                {document.extension}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllDocuments;
