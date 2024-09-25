import NewContactForm from "@/components/common-forms/contact-form";

function NewContactPage({ params }: { params: { id: string } }) {
  return <NewContactForm id={Number(params.id)} type="client" />;
}

export default NewContactPage;
