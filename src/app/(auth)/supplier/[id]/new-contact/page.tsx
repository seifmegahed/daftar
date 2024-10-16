import NewContactForm from "@/components/common-forms/contact-form";
import ErrorPage from "@/components/error";

function NewContactPage({ params }: { params: { id: string } }) {
  const supplierId = parseInt(params.id);
  if (isNaN(supplierId)) return <ErrorPage message="Invalid supplier ID" />;
  
  return <NewContactForm id={supplierId} type="supplier" />;
}

export default NewContactPage;
