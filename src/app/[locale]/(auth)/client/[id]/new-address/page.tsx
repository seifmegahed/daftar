import NewAddressForm from "@/components/common-forms/address-form";
import ErrorPage from "@/components/error";

export default function NewAddressPage({ params }: { params: { id: string } }) {
  const clientId = parseInt(params.id);
  if (isNaN(clientId)) return <ErrorPage message="Invalid client ID" />;
  return <NewAddressForm id={clientId} type="client" />;
}
