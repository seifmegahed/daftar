import DocumentForm from "@/components/common-forms/document-form";
import ErrorPage from "@/components/error";

function NewDocumentPage({ params }: { params: { id: string } }) {
  const projectId = parseInt(params.id);
  if (isNaN(projectId)) return <ErrorPage message="Invalid project ID" />;
  
  return (
    <DocumentForm
      relationData={{ relationTo: "project", relationId: projectId }}
    />
  );
}

export default NewDocumentPage;
