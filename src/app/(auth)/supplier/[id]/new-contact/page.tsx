import NewContactForm from "@/components/common-forms/contact-form";

function NewContactPage({ params }: { params: { id: string } }) {
  return <NewContactForm id={Number(params.id)} type="supplier" />;
}

export default NewContactPage;
