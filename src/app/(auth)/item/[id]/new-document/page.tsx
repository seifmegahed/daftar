import DocumentForm from "@/components/common-forms/document-form";
import ErrorPage from "@/components/error";

function NewDocumentPage({ params }: { params: { id: string } }) {
  const itemId = parseInt(params.id);
  if (isNaN(itemId)) return <ErrorPage message="Invalid Item ID" />;

  return (
    <DocumentForm relationData={{ relationTo: "item", relationId: itemId }} />
  );
}

export default NewDocumentPage;
