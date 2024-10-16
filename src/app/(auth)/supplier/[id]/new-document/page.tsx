import DocumentForm from "@/components/common-forms/document-form";
import ErrorPage from "@/components/error";

function NewDocumentPage({ params }: { params: { id: string } }) {
  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message="Invalid supplier ID" />;

  return (
    <DocumentForm
      relationData={{ relationTo: "supplier", relationId: supplierId }}
    />
  );
}

export default NewDocumentPage;
