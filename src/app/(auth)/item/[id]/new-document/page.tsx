import DocumentForm from "@/components/common-forms/document-form";

function NewDocumentPage({ params }: { params: { id: string } }) {
  return (
    <DocumentForm
      relationData={{ relationTo: "item", relationId: Number(params.id) }}
    />
  );
}

export default NewDocumentPage;
