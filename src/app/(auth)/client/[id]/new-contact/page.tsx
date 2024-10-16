import NewContactForm from "@/components/common-forms/contact-form";
import ErrorPage from "@/components/error";

function NewContactPage({ params }: { params: { id: string } }) {
  const clientId = parseInt(params.id);
  if (isNaN(clientId)) return <ErrorPage message="Invalid client ID" />;
  return <NewContactForm id={clientId} type="client" />;
}

export default NewContactPage;
