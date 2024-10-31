import DocumentForm from "@/components/common-forms/document-form";
import ErrorPage from "@/components/error";

function NewDocumentPage({ params }: { params: { id: string } }) {
  const clientId = parseInt(params.id);
  if (isNaN(clientId)) return <ErrorPage message="Invalid client ID" />;

  return (
    <DocumentForm
      relationData={{ relationTo: "client", relationId: clientId }}
    />
  );
}

export default NewDocumentPage;
